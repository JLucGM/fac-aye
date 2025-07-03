<!doctype html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Consulta PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: -20px;
            width: 250px;
        }

        h1 {
            text-align: center;
        }

        h2 {
            text-align: left;
            margin-top: 20px;
        }

        p {
            font-size: 12px;
        }

        .no-border {
            border-color: white;
            /* Elimina el borde de la tabla */
        }
        .m-0 {
            margin: 0;
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
            font-size: 12px;
        }

        th {
            background-color: #f2f2f2;
            font-size: 12px;
        }

        .patient-info,
        .consultation-info {
            margin-top: 20px;
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
    <!-- <div class=""style="width: 250px; border: none; margin-bottom: 20px; background-color: red;">s</div> -->

    @foreach ($settings as $setting)
    @if($setting->hasMedia('logo'))
    @php
    $path = $setting->getMedia('logo')->first()->getPath();
    $type = pathinfo($path, PATHINFO_EXTENSION);
    $data = file_get_contents($path);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
    @endphp
    <img src="{{ $base64 }}" alt="Logo" style="max-width: 150px;">
    @endif
    @endforeach

    <!-- Mover la fecha aquí -->
    <p class="m-0">Fecha: {{ $fechaHoy->format('d/m/Y') }}</p> <!-- Formatear la fecha -->
    <p class="m-0">Procesado por: <br> {{$auth->name}} {{$auth->lastname}}</p>

    <h3>Comprobante de Asistencia</h3>

    <div class="consultation-info">

        <div class="" style="border-bottom: 3px solid #000; border-top: 3px solid #000; ">
            <h4>Información del Paciente</h4>
            <p> <strong>Identificación:</strong> {{ $consultation->patient->identification }}</p>
            <p> <strong>Nombre:</strong> {{ $consultation->patient->name }}</p>
            <p> <strong>Apellido:</strong> {{ $consultation->patient->lastname }}</p>
            <p> <strong>Email:</strong> {{ $consultation->patient->email }}</p>
            <p> <strong>Teléfono:</strong> {{ $consultation->patient->phone }}</p>
            <p> <strong>Dirección:</strong> {{ $consultation->patient->address }}</p>
            <p> <strong>Fecha de Visita:</strong> {{ $consultation->created_at }}</p>
        </div>

        <!-- <h4>Información de la Consulta</h4>
        <table>
            <tr>
                <th>ID</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Método de Pago</th>
            </tr>
            <tr>
                <td>{{ $consultation->id }}</td>
                <td>{{ $consultation->amount }}</td>
                <td>{{ $consultation->payment_status }}</td>
                <td>{{ $consultation->reference }}</td>
                <td>{{ $consultation->payment_method_id }}</td>
            </tr>
        </table> -->
    </div>

    <div class="services-info">
        <h4>Servicios Realizados</h4>
        <table>
            <tr>
                <!-- <th>ID</th> -->
                <th>Nombre del Servicio</th>
                <th>Precio</th>
            </tr>
            @foreach ($consultation->services as $service)
            <tr>
                <!-- <td>{{ $service->id }}</td> -->
                <td>{{ $service->name }}</td>
                <td>{{ $service->price }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="1">Total</td>
                <td>{{ $consultation->amount }}</td>
            </tr>
        </table>
    </div>
    <p>
        <strong>Nota:</strong> Este comprobante es válido como constancia de asistencia a la consulta médica. Por favor, guárdelo para sus registros.
    </p>

    <div style="padding-top: 50px;">

        <p style="border-top: 3px solid #000; font-size: 16px; text-align: center; ">
            <strong>
                Firma en aceptación asistencia y su
                respectivo pago
            </strong>
        </p>
        <div style="border-top: 3px solid #000; margin-top: 50px;">
            @foreach ($settings as $setting)
            <p>Dirección: {{ $setting->direction }}</p>
            <p>Telef: {{ $setting->phone }} - R.I.F:{{ $setting->rif }}</p>
            @endforeach
        </div>

    </div>
</body>

</html>