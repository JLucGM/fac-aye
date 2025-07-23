<!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Factura #{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        h1, h2, h3, h4 {
            text-align: center;
            margin-bottom: 10px;
        }
        .header, .footer {
            width: 100%;
            text-align: center;
            position: fixed;
        }
        .header {
            top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .footer {
            bottom: 0;
            border-top: 1px solid #eee;
            padding-top: 10px;
            font-size: 10px;
            color: #555;
        }
        .company-info, .invoice-details, .patient-info {
            margin-bottom: 20px;
            /* border: 1px solid #eee; */
            padding: 10px;
            border-radius: 5px;
        }
        .company-info {
            text-align: left;
            float: left;
            width: 48%;
        }
        .invoice-details {
            text-align: right;
            float: right;
            width: 48%;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total-section {
            margin-top: 20px;
            text-align: right;
        }
        .total-section table {
            width: auto;
            float: right;
            margin-top: 0;
        }
        .total-section th, .total-section td {
            border: none;
            padding: 5px 10px;
        }
        .total-section .grand-total {
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .notes {
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 10px;
            font-size: 10px;
            color: #555;
        }
        .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

    <div class="header clearfix">
        @if($settings && $settings->hasMedia('logo'))
            @php
                $path = $settings->getMedia('logo')->first()->getPath();
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $data = file_get_contents($path);
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            @endphp
            <img src="{{ $base64 }}" alt="Logo" class="logo">
        @endif
        <h1>FACTURA</h1>
    </div>

    <div style="margin-top: 120px;" class="clearfix">
        <div class="company-info">
            <h4>Información de la Empresa</h4>
            <p><strong>Nombre:</strong> {{ $settings->name ?? 'N/A' }}</p>
            <p><strong>RIF:</strong> {{ $settings->rif ?? 'N/A' }}</p>
            <p><strong>Dirección:</strong> {{ $settings->direction ?? 'N/A' }}</p>
            <p><strong>Teléfono:</strong> {{ $settings->phone ?? 'N/A' }}</p>
            <p><strong>Email:</strong> {{ $settings->email ?? 'N/A' }}</p>
        </div>

        <div class="invoice-details">
            <h4>Detalles de la Factura</h4>
            <p><strong>Número de Factura:</strong> {{ $invoice->invoice_number }}</p>
            <p><strong>Fecha de Emisión:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}</p>
            {{-- due_date ha sido eliminado --}}
            <!-- <p><strong>Estado:</strong> {{ ucfirst(str_replace('_', ' ', $invoice->status)) }}</p> -->
        </div>
    </div>

    <div style="margin-top: 20px;" class="patient-info clearfix">
        <h4>Información del Paciente</h4>
        <p><strong>Nombre:</strong> {{ $invoice->patient->name }} {{ $invoice->patient->lastname }}</p>
        <p><strong>Identificación:</strong> {{ $invoice->patient->identification }}</p>
        <p><strong>Email:</strong> {{ $invoice->patient->email }}</p>
        <p><strong>Teléfono:</strong> {{ $invoice->patient->phone }}</p>
        <p><strong>Dirección:</strong> {{ $invoice->patient->address }}</p>
    </div>

    <h3>Ítems de la Factura</h3>
    <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total de Línea</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                {{-- La descripción ahora se genera a partir de la consulta asociada --}}
                <td>
                    @if($item->consultation)
                        Consulta del {{ \Carbon\Carbon::parse($item->consultation->scheduled_at)->format('d/m/Y H:i') }}
                        @if($item->consultation->notes)
                            <br><small>Notas: {{ $item->consultation->notes }}</small>
                        @endif
                    @else
                        Ítem de Factura (sin consulta asociada)
                    @endif
                </td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format($item->unit_price, 2, ',', '.') }}</td>
                <td>{{ number_format($item->line_total, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total-section clearfix">
        <table>
            <tr>
                {{-- subtotal y tax_amount ahora se calculan en el controlador y se pasan a la vista 
                <th>Subtotal:</th>
                <td>{{ number_format($subtotal, 2, ',', '.') }}</td>--}}
            </tr>
              {{-- <tr>
                <th>IVA (16%):</th>
                <td>{{ number_format($taxAmount, 2, ',', '.') }}</td>
            </tr>--}}
            <tr class="grand-total">
                <th>Total a Pagar:</th>
                <td>{{ number_format($invoice->total_amount, 2, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    @if($invoice->notes)
    <div class="notes">
        <h4>Notas:</h4>
        <p>{{ $invoice->notes }}</p>
    </div>
    @endif

    <div class="footer">
        <p>Factura generada por {{ $auth->name }} {{ $auth->lastname }} el {{ $fechaHoy->format('d/m/Y') }}</p>
        <p>Gracias por su preferencia.</p>
    </div>

</body>
</html>
