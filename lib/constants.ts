// Public business constants — NOTE: bank account numbers are intentionally
// NOT stored here. They exist only inside components/BankAccountDialog.tsx
// and render only inside the "حساب الدفع" modal.
export const SITE = {
  name: "Journalist",
  arabicName: "منصة البحوث العلمية",
  owner: "محمد أحمد محمد - محمد بحور",
  ownerShort: "محمد احمد محمد",
  email: "mohamed.bahur@gmail.com",
  whatsappDisplay: "00218918199601",
  whatsappNumber: "218918199601",
  whatsappUrl: "https://wa.me/218918199601",
  bankName: "مصرف الجمهورية - المدينة - صبراتة",
  location: "صبراتة، ليبيا",
  currency: "LYD",
} as const;
