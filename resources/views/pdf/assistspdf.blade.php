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
            /* Elimina el borde de la tabla */
        }

        .no-border th,
        .no-border td {
            border: none;
            /* Elimina el borde de las celdas */
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
                    <img src="{{ $base64 }}" alt="Logo" style="max-width: 100px;">
                    @endif
                    @endforeach
                </td>
                <td class="center">
                    <h1>Comprobante de asistencia</h1>
                </td>
                <td>
                    <!-- Mover la fecha aquí -->
                    <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p> <!-- Formatear la fecha -->
                </td>
            </tr>
        </tbody>
    </table>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Fecha de Pago</th>
                <th>Método de Pago</th>
                <th>Paciente Asignado</th> <!-- Nueva columna para el paciente -->
                <!-- <th>Notas</th> -->
            </tr>
        </thead>
        <tbody>
            @foreach ($pagos as $pago)
            <tr>
                <td>{{ $pago->id }}</td>
                <td>{{ $pago->amount }}</td>
                <td>{{ $pago->status }}</td>
                <td>{{ $pago->reference }}</td>
                <td>{{ \Carbon\Carbon::parse($pago->created_at)->format('d/m/Y H:i') }}</td>
                <td>{{ $pago->paymentMethod->name }}</td>
                <td>
                    @foreach ($pago->consultations as $consulta)
                    {{ $consulta->patient->name }} {{ $consulta->patient->lastname }}<br>
                    @endforeach
                </td>
                <!-- <td>{{ $pago->notes }}</td> -->
            </tr>
            @endforeach
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