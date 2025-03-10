const DisplayName = ({ windowWidth, activeEntity, color = "#FFFFFF" }) => {
  const name = activeEntity?.name || activeEntity?.groupName;

  const getFontSize = () => (windowWidth < 400 ? "text-[16px]" : "text-[16px] ");
  const getMaxLength = () => {
    if (windowWidth >= 900) return 28;
    if (windowWidth >= 700) return 32;
    if (windowWidth >= 500) return 28;
    if (windowWidth >= 400) return 22;
    if (windowWidth >= 350) return 20;
    return 18;
  };

  const maxLength = getMaxLength();
  return (
    <p className={` ${getFontSize()} ${windowWidth > 768 && "tracking-wider"} font-bold`} style={{ color: color }}>
      {name.length > maxLength ? name.slice(0, maxLength) + "..." : name}
    </p>
  );
};

export default DisplayName;
