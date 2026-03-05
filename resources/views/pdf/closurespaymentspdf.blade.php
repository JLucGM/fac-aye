<!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            margin-bottom: 80px; /* Espacio para el pie fijo */
            min-height: 100vh;
            position: relative;
        }

        h1 {
            text-align: center;
        }

        h2 {
            margin-top: 20px;
        }

        table {
            width: 100%; /* Ocupar todo el ancho disponible */
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        /* Estilo para la tabla sin bordes (cabecera) */
        .no-border {
            border: none;
        }

        .no-border th,
        .no-border td {
            border: none;
            padding: 5px;
        }

        /* Centrar el texto en la celda del título */
        .center {
            text-align: center;
        }

        /* Pie de página fijo */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px;
            text-align: center;
            font-size: 9px;
            border-top: 1px solid #000;
            padding-top: 5px;
            background-color: white;
            z-index: 1000;
            line-height: 1.2;
        }

        .footer p {
            margin: 2px 0;
        }

        /* Ajustes para la cabecera */
        .header-table td {
            vertical-align: middle;
        }

        .logo-img {
            max-width: 200px;
        }

        /* Para que los totales resalten */
        .total-row {
            font-weight: bold;
            background-color: #e8e8e8;
        }
    </style>
</head>
<body>
    <!-- Cabecera con logo, título y datos del cierre -->
    <table class="no-border header-table">
        <tbody>
            <tr>
                <td style="width: 30%;">
                    @foreach ($settings as $setting)
                        @if($setting->hasMedia('logo'))
                            @php
                                $path = $setting->getMedia('logo')->first()->getPath();
                                $type = pathinfo($path, PATHINFO_EXTENSION);
                                $data = file_get_contents($path);
                                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                            @endphp
                            <img src="{{ $base64 }}" alt="Logo" class="logo-img">
                        @endif
                    @endforeach
                </td>
                <td class="center" style="width: 40%;">
                    <h1>Reporte de Pagos</h1>
                    @if(isset($startDate) && isset($endDate))
                        <p>Desde: {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} Hasta: {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}</p>
                    @endif
                </td>
                <td style="width: 30%; text-align: right;">
                    <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p>
                    <p>Cierre elaborado por: {{ $auth->name }} {{ $auth->lastname }}</p>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Tabla de Pagos de Consulta -->
    <h2>Pagos de Consulta</h2>
    <table>
        <thead>
            <tr>
                <th>Fecha de Pago</th>
                <th>Paciente</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Servicios</th>
                <th>Monto</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($pagosConsulta as $pago)
            <tr>
                <td>{{ \Carbon\Carbon::parse($pago->created_at)->format('d/m/Y H:i') }}</td>
                <td>
                    @if ($pago->consultations->isNotEmpty())
                        {{ $pago->consultations->first()->patient->name }} {{ $pago->consultations->first()->patient->lastname }}
                    @else
                        Sin paciente
                    @endif
                </td>
                <td>{{ $pago->paymentMethod->name ?? 'N/A' }}</td>
                <td>{{ $pago->status }}</td>
                <td>{{ $pago->reference ?? 'Sin referencia' }}</td>
                <td>
                    @if ($pago->consultations->isNotEmpty())
                        @foreach ($pago->consultations as $consulta)
                            @php
                                $services = json_decode($consulta->services, true) ?? [];
                            @endphp
                            @foreach ($services as $service)
                                {{ $service['name'] }} (${{ number_format($service['price'], 2) }})<br>
                            @endforeach
                        @endforeach
                    @else
                        Sin servicios
                    @endif
                </td>
                <td>${{ number_format($pago->amount, 2) }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="6" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>${{ number_format($totalAmountConsulta, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    <!-- Tabla de Pagos de Suscripción -->
    <h2>Pagos de Suscripción</h2>
    <table>
        <thead>
            <tr>
                <th>Fecha de Pago</th>
                <th>Paciente</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Suscripción</th>
                <th>Monto</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($pagosSuscripcion as $pago)
            <tr>
                <td>{{ \Carbon\Carbon::parse($pago->created_at)->format('d/m/Y H:i') }}</td>
                <td>
                    @if ($pago->patientSubscriptions->isNotEmpty())
                        {{ $pago->patientSubscriptions->first()->patient->name }} {{ $pago->patientSubscriptions->first()->patient->lastname }}
                    @else
                        Sin paciente
                    @endif
                </td>
                <td>{{ $pago->paymentMethod->name ?? 'N/A' }}</td>
                <td>{{ $pago->status }}</td>
                <td>{{ $pago->reference ?? 'Sin referencia' }}</td>
                <td>
                    @if ($pago->patientSubscriptions->isNotEmpty())
                        @foreach ($pago->patientSubscriptions as $subscription)
                            {{ $subscription->subscription->name ?? 'N/A' }}<br>
                        @endforeach
                    @else
                        Sin suscripción
                    @endif
                </td>
                <td>${{ number_format($pago->amount, 2) }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="6" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>${{ number_format($totalAmountSuscripcion, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    <!-- Pie de página fijo con datos de la empresa -->
    <div class="footer">
        @foreach ($settings as $setting)
            <p>Dirección: {{ $setting->direction }} | Teléf: {{ $setting->phone }} | R.I.F: {{ $setting->rif }}</p>
        @endforeach
    </div>
</body>
</html>