<!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Factura #{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            margin-bottom: 80px; /* Espacio para el pie fijo */
            min-height: 100vh;
            position: relative;
            font-size: 12px;
        }
        h1, h2, h3, h4 {
            text-align: center;
            margin-bottom: 10px;
        }
        h1 {
            font-size: 18px;
        }
        h4 {
            font-size: 14px;
            text-align: left;
            margin-top: 0;
        }
        /* Estilos para la cabecera sin bordes */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .header-table td {
            border: none;
            padding: 5px;
            vertical-align: middle;
        }
        .logo-cell {
            width: 30%;
            text-align: left;
        }
        .title-cell {
            width: 40%;
            text-align: center;
        }
        .info-cell {
            width: 30%;
            text-align: right;
        }
        .logo-img {
            max-width: 150px;
            height: auto;
        }

        /* Bloques de información empresa y factura */
        .info-block {
            width: 48%;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .company-info {
            float: left;
        }
        .invoice-details {
            float: right;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        /* Información del paciente */
        .patient-info {
            clear: both;
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }

        /* Tabla de ítems */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
        }
        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }

        /* Sección de totales */
        .total-section {
            margin-top: 20px;
            text-align: right;
        }
        .total-section table {
            width: auto;
            float: right;
            border: none;
        }
        .total-section th, .total-section td {
            border: none;
            padding: 5px 10px;
            background-color: transparent;
        }
        .total-section .grand-total {
            font-weight: bold;
            background-color: #f2f2f2;
        }

        /* Notas */
        .notes {
            clear: both;
            margin-top: 30px;
            border-top: 1px solid #000;
            padding-top: 10px;
            font-size: 10px;
            color: #555;
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
    </style>
</head>
<body>
    <!-- Cabecera con logo, título y fecha (similar a los otros PDF) -->
    <table class="header-table">
        <tr>
            <td class="logo-cell">
                @if($settings && $settings->hasMedia('logo'))
                    @php
                        $path = $settings->getMedia('logo')->first()->getPath();
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $data = file_get_contents($path);
                        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    @endphp
                    <img src="{{ $base64 }}" alt="Logo" class="logo-img">
                @endif
            </td>
            <td class="title-cell">
                <h1>FACTURA</h1>
                <p>N° {{ $invoice->invoice_number }}</p>
            </td>
            <td class="info-cell">
                <p>Fecha emisión: {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}</p>
                <p>Elaborado por: {{ $auth->name ?? '' }} {{ $auth->lastname ?? '' }}</p>
            </td>
        </tr>
    </table>

    <!-- Información de empresa y detalles de factura en dos columnas -->
    <div class="clearfix">
        <div class="company-info info-block">
            <h4>Información de la Empresa</h4>
            <p><strong>{{ $settings->name ?? 'N/A' }}</strong></p>
            <p><strong>R.I.F:</strong> {{ $settings->rif ?? 'N/A' }}</p>
            <p><strong>Dirección:</strong> {{ $settings->direction ?? 'N/A' }}</p>
            <p><strong>Teléfono:</strong> {{ $settings->phone ?? 'N/A' }}</p>
            <p><strong>Email:</strong> {{ $settings->email ?? 'N/A' }}</p>
        </div>

        <div class="invoice-details info-block">
            <h4>Detalles de la Factura</h4>
            <p><strong>Número:</strong> {{ $invoice->invoice_number }}</p>
            <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}</p>
            @if(isset($invoice->due_date))
                <p><strong>Vence:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('d/m/Y') }}</p>
            @endif
            {{-- <p><strong>Estado:</strong> {{ ucfirst(str_replace('_', ' ', $invoice->status)) }}</p> --}}
        </div>
    </div>

    <!-- Información del paciente -->
    <div class="patient-info">
        <h4>Información del Paciente</h4>
        <p><strong>Nombre:</strong> {{ $invoice->patient->name }} {{ $invoice->patient->lastname }}</p>
        <p><strong>Identificación:</strong> {{ $invoice->patient->identification }}</p>
        <p><strong>Email:</strong> {{ $invoice->patient->email }}</p>
        <p><strong>Teléfono:</strong> {{ $invoice->patient->phone }}</p>
        <p><strong>Dirección:</strong> {{ $invoice->patient->address }}</p>
    </div>

    <!-- Ítems de la factura -->
    <h3>Ítems de la Factura</h3>
    <table>
        <thead>
            <tr>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th>Precio Unitario</th>
                <th>Total de Línea</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td>{{ $item->quantity }}</td>
                <td>{{ $item->service_name }}</td>
                <td>{{ number_format($item->unit_price, 2, ',', '.') }}</td>
                <td>{{ number_format($item->line_total, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totales -->
    <div class="total-section clearfix">
        <table>
            {{-- Si hubiera subtotal y tax, se pueden agregar --}}
            <tr class="grand-total">
                <th>Total a Pagar:</th>
                <td>{{ number_format($invoice->total_amount, 2, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    <!-- Notas -->
    @if($invoice->notes)
    <div class="notes">
        <h4>Notas:</h4>
        <p>{{ $invoice->notes }}</p>
    </div>
    @endif

    <!-- Pie de página fijo -->
    <div class="footer">
        <p>Dirección: {{ $settings->direction ?? '' }} | Teléf: {{ $settings->phone ?? '' }} | R.I.F: {{ $settings->rif ?? '' }}</p>
        <p>Gracias por su preferencia.</p>
    </div>
</body>
</html>