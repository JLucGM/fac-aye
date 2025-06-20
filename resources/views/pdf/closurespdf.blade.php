<!doctype html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

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

    th,
    td {
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
  <h1>Reporte de Consultas</h1>
  <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p> <!-- Formatear la fecha -->
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Paciente</th>
        <th>Tratante</th>
        <th>Tipo de Consulta</th>
        <th>Estado</th>
        <th>Fecha Programada</th>
        <th>Estado de pago</th>
        <th>Monto</th>
        <th>Usuario Asignado</th> <!-- Nueva columna para el usuario -->
      </tr>
    </thead>
    <tbody>
      @foreach ($consultas as $consulta)
      <tr>
        <td>{{ $consulta->id }}</td>
        <td>{{ $consulta->patient->name }} {{ $consulta->patient->lastname }}</td>
        <td>
          {{ $consulta->user->name }} {{ $consulta->user->lastname }} <!-- Mostrar el usuario asignado -->
        </td>
        <td>{{ $consulta->consultation_type }}</td>
        <td>{{ $consulta->status }}</td>
        <td>{{ \Carbon\Carbon::parse($consulta->scheduled_at)->format('d/m/Y H:i') }}</td>
        <td>{{ $consulta->payment_status }}</td>
        <td>{{ $consulta->amount }}</td>
        <td>
          @foreach ($consulta->services as $service)
          {{ $service->name }} ({{ $service->price }})<br>
          @endforeach
        </td>
      </tr>
      @endforeach
    </tbody>
  </table>
</body>

</html>