<!doctype html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            position: relative;
        }

        h1 {
            text-align: center;
        }

        h2 {
            margin-top: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        /* Estilo para la tabla sin bordes */
        .no-border {
            border: none;
        }

        .no-border th,
        .no-border td {
            border: none;
        }

        /* Centrar el texto en la celda del título */
        .center {
            text-align: center;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            border-top: 1px solid #000;
            padding-top: 5px;
        }
    </style>
</head>

<body>
    <table class="no-border">
        <tbody>
            <tr>
                <td>
                    @foreach ($settings as $setting)
                    @if($setting->hasMedia('logo'))
                    @php
                    $path = $setting->getMedia('logo')->first()->getPath();
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    @endphp
                    <img src="{{ $base64 }}" alt="Logo" style="width: 250px;">
                    @endif
                    @endforeach
                </td>
                <td class="center">
                    <h1>Reporte de Pagos</h1>
                    @if(isset($startDate) && isset($endDate))
                    <p>Desde: {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} Hasta: {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}</p>
                    @endif
                </td>
                <td>
                    <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p>
                    <p>Cierre elaborado por: <br> {{$auth->name}} {{$auth->lastname}}</p>
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
                <td>{{ $pago->paymentMethod->name }}</td>
                <td>{{ $pago->status }}</td>
                <td>
                    @if ($pago->reference)
                    {{ $pago->reference }}
                    @else
                    Sin referencia
                    @endif
                </td>
                <td>
                    @if ($pago->consultations->isNotEmpty())
                    @foreach ($pago->consultations as $consulta)
                    @php
                    $services = json_decode($consulta->services, true);
                    @endphp
                    @foreach ($services as $service)
                    {{ $service['name'] }} ({{ $service['price'] }})<br>
                    @endforeach
                    @endforeach
                    @else
                    Sin servicios
                    @endif
                </td>
                <td>{{ $pago->amount }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="6" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>{{ $totalAmountConsulta }}</strong></td>
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
                <td>{{ $pago->paymentMethod->name }}</td>
                <td>{{ $pago->status }}</td>
                <td>
                    @if ($pago->reference)
                    {{ $pago->reference }}
                    @else
                    Sin referencia
                    @endif
                </td>

                <td>
                    @if ($pago->patientSubscriptions->isNotEmpty())
                    @foreach ($pago->patientSubscriptions as $subscription)
                    {{ $subscription->subscription->name }}<br>
                    @endforeach
                    @else
                    Sin suscripción
                    @endif
                </td>
                <td>{{ $pago->amount }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="6" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>{{ $totalAmountSuscripcion }}</strong></td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        @foreach ($settings as $setting)
        <p>Dirección: {{ $setting->direction }}</p>
        <p>Telef: {{ $setting->phone }} - R.I.F:{{ $setting->rif }}</p>
        @endforeach
    </div>
</body>

</html>