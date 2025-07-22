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

    /* Estilo para el pie de página */
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

    @page {
      margin-bottom: 50px;
      /* Espacio para el pie de página */
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
          <img src="{{ $base64 }}" alt="Logo" style="max-width: 250px;">
          @endif
          @endforeach
        </td>
        <td class="center">
          <h1>Reporte de Consultas</h1>
          <p>Desde: {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} Hasta: {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}</p>
        </td>
        <td>
          <!-- Mover la fecha aquí -->
          <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p> <!-- Formatear la fecha -->
          <p>Cierre elaborado por: <br> {{$auth->name}} {{$auth->lastname}}</p>
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th>Paciente</th>
        <th>Tratante</th>
        <th>Tipo de Consulta</th>
        <th>Estado</th>
        <th>Fecha Programada</th>
        <th>Estado de pago</th>
        <th>Monto</th>
        <th>Servicios</th> <!-- Cambiar el encabezado de la columna -->
      </tr>
    </thead>
    <tbody>
      @foreach ($consultas as $consulta)
      <tr>
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
          @if ($consulta->services)
            @php
              $services = json_decode($consulta->services);
              $serviceNames = array_map(function($service) {
                return $service->name;
              }, $services);
            @endphp
            {{ implode(', ', $serviceNames) }} <!-- Mostrar los nombres de los servicios -->
          @else
            Sin servicios
          @endif
        </td>
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
