import Image from "next/image";

const payments = [
  { src: "/footer/googlepay.svg", alt: "Google Pay" },
  { src: "/footer/paytm.svg", alt: "Paytm" },
  { src: "/footer/paypal.svg", alt: "PayPal" },
  { src: "/footer/visa.svg", alt: "Visa" },
  { src: "/footer/mastercard.svg", alt: "Mastercard" },
  { src: "/footer/apple.svg", alt: "Apple Pay" },
];

export default function PaymentIcons() {
  return (
    <div className="space-y-3">
      <p className="text-xs tracking-wider text-indigo-200 text-center">
        100% SECURE PAYMENT
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {payments.map((p) => (
          <div
            key={p.alt}
            className="bg-white/90 rounded-md px-3 py-2
                       flex items-center justify-center
                       shadow-sm"
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={40}
              height={24}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
