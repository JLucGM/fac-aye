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

    <!-- Resumen por Método de Pago -->
    <h2>Resumen por Método de Pago</h2>
    <table>
        <thead>
            <tr>
                <th>Método de Pago</th>
                <th>Cantidad de Pagos</th>
                <th>Total Recaudado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($paymentMethodSummary as $data)
            <tr>
                <td>{{ $data['name'] }}</td>
                <td>{{ $data['count'] }}</td>
                <td>${{ number_format($data['total'], 2) }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td style="text-align: right;"><strong>Total General:</strong></td>
                <td><strong>{{ collect($paymentMethodSummary)->sum('count') }}</strong></td>
                <td><strong>${{ number_format(collect($paymentMethodSummary)->sum('total'), 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    @php
    $todosPagos = collect($pagosConsulta)->merge($pagosSuscripcion);
    $pagosAgrupados = $todosPagos->groupBy(function($pago) {
        return $pago->paymentMethod->name ?? 'N/A';
    });
    @endphp

    @foreach($pagosAgrupados as $metodo => $pagos)
    @php
    $cantidad = $pagos->count();
    $totalMetodo = $pagos->sum('amount');
    @endphp
    <h3>{{ $metodo }} ({{ $cantidad }} pagos - Total: ${{ number_format($totalMetodo, 2) }})</h3>
    <table>
        <thead>
            <tr>
                <th>Fecha de Pago</th>
                <th>Paciente</th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Tipo</th>
                <th>Monto</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pagos as $pago)
            <tr>
                <td>{{ \Carbon\Carbon::parse($pago->created_at)->format('d/m/Y H:i') }}</td>
                <td>
                    @if ($pago->consultations->isNotEmpty())
                        {{ $pago->consultations->first()->patient->name }} {{ $pago->consultations->first()->patient->lastname }}
                    @elseif ($pago->patientSubscriptions->isNotEmpty())
                        {{ $pago->patientSubscriptions->first()->patient->name }} {{ $pago->patientSubscriptions->first()->patient->lastname }}
                    @else
                        Sin paciente
                    @endif
                </td>
                <td>{{ $pago->status }}</td>
                <td>{{ $pago->reference ?? 'Sin referencia' }}</td>
                <td>
                    @if ($pago->consultations->isNotEmpty())
                        Consulta
                    @elseif ($pago->patientSubscriptions->isNotEmpty())
                        Suscripción
                    @else
                        N/A
                    @endif
                </td>
                <td>${{ number_format($pago->amount, 2) }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="5" style="text-align: right;"><strong>Total del método:</strong></td>
                <td><strong>${{ number_format($totalMetodo, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>
    @endforeach

    <!-- Pie de página fijo con datos de la empresa -->
    <div class="footer">
        @foreach ($settings as $setting)
            <p>Dirección: {{ $setting->direction }} | Teléf: {{ $setting->phone }} | R.I.F: {{ $setting->rif }}</p>
        @endforeach
    </div>
</body>
</html>