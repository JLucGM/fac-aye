<!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            margin-bottom: 80px; /* Espacio suficiente para el pie fijo */
            min-height: 100vh;
            position: relative;
        }
        h1 { text-align: center; }
        h2 { margin-top: 20px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        th { background-color: #f2f2f2; }
        .no-border { border: none; }
        .no-border th, .no-border td { border: none; }
        .center { text-align: center; }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px;
            text-align: center;
            font-size: 10px;
            border-top: 1px solid #000;
            padding-top: 5px;
            background-color: white;
            z-index: 1000;
            line-height: 1.2;
        }
        .group-title { background-color: #e0e0e0; font-weight: bold; }
        .group-total { background-color: #d9edf7; font-weight: bold; }
    </style>
</head>
<body>
    <!-- Cabecera con logo, fechas y usuario -->
    <table class="no-border">
        <tbody>
            <tr>
                <td>
                    @if($settings && $settings->hasMedia('logo'))
                        @php
                            $path = $settings->getMedia('logo')->first()->getPath();
                            $type = pathinfo($path, PATHINFO_EXTENSION);
                            $data = file_get_contents($path);
                            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                        @endphp
                        <img src="{{ $base64 }}" alt="Logo" style="max-width: 250px;">
                    @endif
                </td>
                <td class="center">
                    <h1>Reporte de Asistencias</h1>
                    @if(isset($startDate) && isset($endDate))
                        <p>Desde: {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} Hasta: {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}</p>
                    @else
                        <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p>
                    @endif
                </td>
                <td>
                    <p>Fecha: {{ $fechaHoy->format('d/m/Y') }}</p>
                    <p>Cierre elaborado por: <br> {{ $auth->name }} {{ $auth->lastname }}</p>
                </td>
            </tr>
        </tbody>
    </table>

    @php
        // ==================== PROCESAR DATOS ====================
        $servicios = [];
        $suscripciones = [];

        foreach ($consultas as $consulta) {
            $servicesArray = json_decode($consulta->services, true) ?? [];

            if ($consulta->patient_subscription_id && $consulta->amount == 0) {
                // Es una consulta de suscripción (funcional)
                // CORRECCIÓN: acceder al nombre a través de subscription->subscription
                $nombreSuscripcion = optional($consulta->subscription)->subscription->name ?? 'Suscripción sin nombre';
                $suscripciones[] = [
                    'nombre' => $nombreSuscripcion,
                    'consulta' => $consulta,
                ];
            } else {
                // Consulta individual
                foreach ($servicesArray as $service) {
                    $servicios[] = [
                        'nombre' => $service['name'],
                        'precio' => floatval($service['price']),
                        'consulta' => $consulta,
                    ];
                }
            }
        }

        $serviciosAgrupados = collect($servicios)->groupBy('nombre');
        $suscripcionesAgrupadas = collect($suscripciones)->groupBy('nombre');
    @endphp

    <!-- ==================== SECCIÓN DE SERVICIOS ==================== -->
    <h2>Asistencias prestadas</h2>
    @forelse($serviciosAgrupados as $nombreServicio => $items)
        @php
            $cantidad = $items->count();
            $totalServicio = $items->sum('precio');
        @endphp
        <h3>{{ $nombreServicio }} ({{ $cantidad }} servicios - Total: ${{ number_format($totalServicio, 2) }})</h3>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>C.I.</th>
                    <th>Tipo</th>
                    <th>Estado pago</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                    @php $c = $item['consulta']; @endphp
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($c->created_at)->format('d/m/Y H:i') }}</td>
                        <td>{{ $c->patient->name ?? '' }} {{ $c->patient->lastname ?? '' }}</td>
                        <td>{{ $c->patient->identification ?? '' }}</td>
                        <td>{{ $c->consultation_type }}</td>
                        <td>{{ $c->payment_status }}</td>
                        <td>${{ number_format($item['precio'], 2) }}</td>
                    </tr>
                @endforeach
                <tr class="group-total">
                    <td colspan="5" style="text-align: right;"><strong>Total del servicio:</strong></td>
                    <td><strong>${{ number_format($totalServicio, 2) }}</strong></td>
                </tr>
            </tbody>
        </table>
    @empty
        <p>No hay servicios individuales en el período.</p>
    @endforelse

    @php
        $totalGeneralServicios = collect($servicios)->sum('precio');
    @endphp
    <p style="text-align: right; font-weight: bold; margin-top: 10px;">Total general servicios: ${{ number_format($totalGeneralServicios, 2) }}</p>

    <!-- ==================== SECCIÓN DE SUSCRIPCIONES ==================== -->
    <h2 style="margin-top: 30px;">Consultas por Funcionales</h2>
    @forelse($suscripcionesAgrupadas as $nombreSuscripcion => $items)
        @php
            $cantidad = $items->count();
        @endphp
        <h3>{{ $nombreSuscripcion }} ({{ $cantidad }} consultas)</h3>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>C.I.</th>
                    <th>Tipo</th>
                    <th>Estado pago</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                    @php $c = $item['consulta']; @endphp
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($c->created_at)->format('d/m/Y H:i') }}</td>
                        <td>{{ $c->patient->name ?? '' }} {{ $c->patient->lastname ?? '' }}</td>
                        <td>{{ $c->patient->identification ?? '' }}</td>
                        <td>{{ $c->consultation_type }}</td>
                        <td>{{ $c->payment_status }}</td>
                    </tr>
                @endforeach
                <tr class="group-total">
                    <td colspan="4" style="text-align: right;"><strong>Total de consultas del funcional:</strong></td>
                    <td><strong>{{ $cantidad }}</strong></td>
                </tr>
            </tbody>
        </table>
    @empty
        <p>No hay consultas por suscripción en el período.</p>
    @endforelse

    @php
        $totalGeneralSuscripciones = $suscripcionesAgrupadas->flatten(1)->count();
    @endphp
    <p style="text-align: right; font-weight: bold; margin-top: 10px;">Total consultas por suscripción: {{ $totalGeneralSuscripciones }}</p>

    <!-- Pie de página -->
    <div class="footer">
        @if($settings)
            <p>Dirección: {{ $settings->direction }}</p>
            <p>Teléf: {{ $settings->phone }} - R.I.F: {{ $settings->rif }}</p>
        @endif
    </div>
</body>
</html>