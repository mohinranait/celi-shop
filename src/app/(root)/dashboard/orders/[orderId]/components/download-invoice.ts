import { CURRENCY } from "@/lib/envSecret";
import { IOrder } from "@/redux/service/orders/type";
import { format } from "date-fns";
const formatCurrency = (amount: number) => `${CURRENCY}${amount.toFixed(2)}`;

export const formateDownloadInvoice = async (order: IOrder) => {
  const jsPDF = (await import("jspdf")).default;
  const html2canvas = (await import("html2canvas")).default;

  const invoiceElement = document.createElement("div");
  invoiceElement.innerHTML = `
        <div style="
          font-family: 'Helvetica', 'Arial', sans-serif;
          max-width: 850px;
          margin: 0 auto;
          padding: 50px;
          background: #ffffff;
          color: #1a1a1a;
          line-height: 1.7;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          <!-- Header -->
          <div style="
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 4px solid #4a90e2;
            padding-bottom: 20px;
          ">
            <img src="https://via.placeholder.com/150x50?text=Your+Company+Logo" alt="Company Logo" style="margin-bottom: 10px;">
            <h1 style="
              font-size: 28px;
              font-weight: 700;
              color: #2c3e50;
              margin: 0;
            ">INVOICE</h1>
            <p style="color: #7f8c8d; font-size: 14px;">Invoice #INV-0000</p>
          </div>

          <!-- Invoice Info -->
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            gap: 30px;
          ">
            <div style="flex: 1;">
              <h3 style="
                color: #2c3e50;
                font-size: 18px;
                margin-bottom: 15px;
                border-bottom: 2px solid #ecf0f1;
                padding-bottom: 5px;
              ">Bill To:</h3>
              <div style="color: #7f8c8d;">
                <p style="margin: 5px 0; font-weight: 500;">Mohin Rana</p>
                <p style="margin: 5px 0;">mohin@gmail.com</p>
                <p style="margin: 5px 0;">01728068200</p>
               <p style="margin: 5px 0;">Uttara, Dhaka, Bangladesh</p>
              </div>
            </div>
            <div style="flex: 1;">
              <h3 style="
                color: #2c3e50;
                font-size: 18px;
                margin-bottom: 15px;
                border-bottom: 2px solid #ecf0f1;
                padding-bottom: 5px;
              ">Invoice Details:</h3>
              <div style="color: #7f8c8d;">
                <p style="margin: 8px 0;"><strong>Order #:</strong> ${order?.invoiceNumber || "ORD-0000"
    }</p>
                <p style="margin: 8px 0;"><strong>Date:</strong> ${format(
      new Date(Date.now()),
      "dd MMM yyyy"
    )}</p>
                <p style="margin: 8px 0;"><strong>Status:</strong> <span style="
                  background: #e8f4f8;
                  color: #3498db;
                  padding: 5px 10px;
                  border-radius: 5px;
                  font-size: 12px;
                  text-transform: capitalize;
                ">${order?.orderStatus || "N/A"}</span></p>
                <p style="margin: 8px 0;"><strong>Tracking #:</strong> ${order?.invoiceNumber || "N/A"
    }</p>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div style="margin-bottom: 40px;">
            <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 20px;">Order Items</h3>
            <table style="
              width: 100%;
              border-collapse: collapse;
              background: #ffffff;
              border: 1px solid #ecf0f1;
              border-radius: 8px;
              overflow: hidden;
            ">
              <thead>
                <tr style="background: #f5f6fa;">
                  <th style="
                    padding: 12px 15px;
                    text-align: left;
                    font-weight: 600;
                    color: #2c3e50;
                    border-bottom: 2px solid #ecf0f1;
                  ">Description</th>
                  <th style="
                    padding: 12px 15px;
                    text-align: right;
                    font-weight: 600;
                    color: #2c3e50;
                    border-bottom: 2px solid #ecf0f1;
                  ">Unit Price</th>
                  <th style="
                    padding: 12px 15px;
                    text-align: center;
                    font-weight: 600;
                    color: #2c3e50;
                    border-bottom: 2px solid #ecf0f1;
                  ">Qty</th>
                  <th style="
                    padding: 12px 15px;
                    text-align: right;
                    font-weight: 600;
                    color: #2c3e50;
                    border-bottom: 2px solid #ecf0f1;
                  ">Total</th>
                </tr>
              </thead>
              <tbody>
                ${(order?.items || [])
      .map(
        (item, index) => `
                  <tr style="${index % 2 === 0
            ? "background: #fafafa;"
            : "background: #ffffff;"
          }">
                    <td style="
                      padding: 12px 15px;
                      border-bottom: 1px solid #ecf0f1;
                      color: #7f8c8d;
                    ">${item.productName}</td>
                    <td style="
                      padding: 12px 15px;
                      text-align: right;
                      border-bottom: 1px solid #ecf0f1;
                      color: #7f8c8d;
                    ">${formatCurrency(item.price)}</td>
                    <td style="
                      padding: 12px 15px;
                      text-align: center;
                      border-bottom: 1px solid #ecf0f1;
                      color: #7f8c8d;
                    ">${item.quantity}</td>
                    <td style="
                      padding: 12px 15px;
                      text-align: right;
                      border-bottom: 1px solid #ecf0f1;
                      color: #7f8c8d;
                      font-weight: 500;
                    ">${formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                `
      )
      .join("")}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
            <div style="
              min-width: 300px;
              border: 1px solid #ecf0f1;
              border-radius: 8px;
              overflow: hidden;
              background: #ffffff;
            ">
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 10px 15px;
                background: #f5f6fa;
                border-bottom: 1px solid #ecf0f1;
              ">
                <span style="color: #2c3e50;">Subtotal:</span>
                <span style="color: #2c3e50;">${formatCurrency(order?.pricing?.subtotal)}</span>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 10px 15px;
                background: #ffffff;
                border-bottom: 1px solid #ecf0f1;
              ">
                <span style="color: #2c3e50;">Shipping:</span>
                <span style="color: #2c3e50;">${formatCurrency(
        order?.pricing?.shippingCharge
      )}</span>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 10px 15px;
                background: #f5f6fa;
                border-bottom: 1px solid #ecf0f1;
              ">
                <span style="color: #2c3e50;">Tax:</span>
                <span style="color: #2c3e50;">${formatCurrency(order?.pricing?.tax)}</span>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 10px 15px;
                background: #ffffff;
                border-bottom: 1px solid #ecf0f1;
              ">
                <span style="color: #2c3e50;">Discount:</span>
                <span style="color: #2c3e50;">-${formatCurrency(0)}</span>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 12px 15px;
                background: #4a90e2;
                color: #ffffff;
                font-weight: 600;
                font-size: 16px;
              ">
                <span>Total:</span>
                <span>${formatCurrency(order?.pricing?.total || 0)}</span>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div style="
            background: #f9fbfd;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4a90e2;
            margin-bottom: 40px;
          ">
            <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px;">Payment Method</h3>
            <p style="color: #7f8c8d; margin: 0;">${order?.payment?.method || "N/A"
    } </p>
          </div>

          <!-- Footer -->
          <div style="
            text-align: center;
            padding-top: 30px;
            border-top: 2px solid #ecf0f1;
            color: #7f8c8d;
          ">
            <p style="margin: 10px 0; font-size: 16px; font-weight: 600; color: #4a90e2;">
              Thank You for Your Business!
            </p>
            <p style="margin: 5px 0; font-size: 12px;">
              For inquiries, contact us at <a href="mailto:support@yourcompany.com" style="color: #3498db; text-decoration: none;">support@yourcompany.com</a>
            </p>
            <p style="margin: 5px 0; font-size: 12px;">
              Phone: ${"+1 (555) 123-4567"} | Website: <a href="https://www.yourcompany.com" style="color: #3498db; text-decoration: none;">www.yourcompany.com</a>
            </p>
          </div>
        </div>
      `;

  invoiceElement.style.position = "absolute";
  invoiceElement.style.left = "-9999px";
  invoiceElement.style.top = "0";
  document.body.appendChild(invoiceElement);

  const canvas = await html2canvas(invoiceElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    width: 850,
    height: invoiceElement.scrollHeight,
  });

  document.body.removeChild(invoiceElement);

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`Invoice-${order?.invoiceNumber || "INV-0000"}.pdf`);
}