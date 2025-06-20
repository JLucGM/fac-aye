<!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="flex justify-between">
        <h1>Reporte de Pagos</h1>
        <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p> <!-- Formatear la fecha -->
    </div>
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
</body>
</html>