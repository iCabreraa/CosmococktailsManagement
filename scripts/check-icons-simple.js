// Script simple para verificar iconos
const hi2 = require("react-icons/hi2");

// Lista de iconos que estamos usando
const iconsToCheck = [
  "HiOutlineBell",
  "HiOutlineCheckCircle",
  "HiOutlineMagnifyingGlass",
  "HiOutlineAdjustmentsHorizontal",
  "HiXMark",
  "HiOutlineUsers",
  "HiOutlineShoppingBag",
  "HiOutlineCurrencyEuro",
  "HiOutlineUser",
  "HiOutlineEnvelope",
  "HiOutlinePhone",
  "HiOutlineMapPin",
  "HiOutlineCalendarDays",
  "HiOutlineCog6Tooth",
  "HiOutlineHome",
  "HiOutlineHomeModern",
  "HiOutlineArchiveBox",
  "HiOutlineUserGroup",
  "HiOutlineCurrencyDollar",
  "HiOutlineCreditCard",
  "HiOutlineChatBubbleBottomCenterText",
  "HiOutlineBeaker",
  "HiOutlineBriefcase",
  "HiOutlineChartPie",
  "HiOutlineBanknotes",
  "HiOutlineMoon",
  "HiOutlineSun",
];

console.log("🔍 Verificando iconos en react-icons/hi2...\n");

iconsToCheck.forEach(iconName => {
  if (hi2[iconName]) {
    console.log(`✅ ${iconName} - EXISTE`);
  } else {
    console.log(`❌ ${iconName} - NO EXISTE`);
  }
});

console.log("\n📋 Algunos iconos disponibles en hi2:");
const availableIcons = Object.keys(hi2).filter(key => key.startsWith("Hi"));
console.log(availableIcons.slice(0, 30).join(", "));
