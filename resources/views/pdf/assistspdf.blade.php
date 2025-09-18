<!doctype html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Consulta PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: -30px;
            width: 140px;
        }

        h1 {
            text-align: center;
        }

        h2 {
            text-align: left;
            margin-top: 16px;
        }
        h4 {
            text-align: left;
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 12px;
        }

        p {
            font-size: 10px;
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
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 10px;
        }

        th {
            background-color: #f2f2f2;
            font-size: 10px;
        }

        .notes {
            font-size: 8px;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
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

    <h4>Comprobante de Asistencia</h4>

    <div class="">

        <div class="" style="border-bottom: 3px solid #000; border-top: 3px solid #000; ">
            <p> <strong>Fecha de asistencia:</strong> {{ $consultation->created_at }}</p>
            <h4>Información del Paciente</h4>
            <p> <strong>C.I:</strong> {{ $consultation->patient->identification }}</p>
            <p> <strong>Nombre y apellido:</strong> {{ $consultation->patient->name }} {{ $consultation->patient->lastname }}</p>
            <!-- <p> <strong>Apellido:</strong> {{ $consultation->patient->lastname }}</p> -->
            <p> <strong>Email:</strong> {{ $consultation->patient->email }}</p>
            <p> <strong>Teléfono:</strong> {{ $consultation->patient->phone }}</p>
            <p> <strong>Dirección:</strong> {{ $consultation->patient->address }}</p>
            <!-- @if ($consultation->patient->subscriptions->isNotEmpty())
            <p><strong>Funcional:</strong> {{ $consultation->patient->subscriptions->first()->subscription->name }}</p>
            @else
            <p>Sin funcional</p>
            @endif -->
        </div>
    </div>

    <div class="">
        <h4>Servicios Realizados</h4>
        <table>
            <tr>
                <th>Nombre del Servicio</th>
                <th>Precio</th>
            </tr>
            @php
            // Analiza la cadena JSON de servicios
            $services = json_decode($consultation->services, true);
            @endphp
            @foreach ($services as $service)
            <tr>
                <td>{{ $service['name'] }}</td>
                <td>{{ $service['price'] }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="1">Total</td>
                <td>{{ $consultation->amount }}</td>
            </tr>
        </table>
    </div>

    <p class="notes">
        <strong>Nota:</strong> Este comprobante es válido como constancia de asistencia a la consulta médica. Por favor, guárdelo para sus registros.
    </p>

    <div style="padding-top: 50px;">

        <p style="border-top: 3px solid #000; font-size: 12px; text-align: center; ">
            <strong>
                Firma en aceptación asistencia y su
                respectivo pago
            </strong>
        </p>
        <!-- <div style="border-top: 3px solid #000; margin-top: 50px;">
            @foreach ($settings as $setting)
            <p>Dirección: {{ $setting->direction }}</p>
            <p>Telef: {{ $setting->phone }} - R.I.F:{{ $setting->rif }}</p>
            @endforeach
        </div> -->

    </div>
</body>

</html>