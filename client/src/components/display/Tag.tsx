const Tag = (props: {
  text: string;
  title?: string;
  href?: string;
  bgColor?: string;
  icon?: string;
}) => {
  const defaultBgColor = "#e5e7eb";

  let useBgColor = props.bgColor ? props.bgColor : defaultBgColor;
  let useTxtColor = useBgColor === defaultBgColor ? "#000" : "#fff";
  return (
    <span
      title={props.title}
      className="rounded-pill opacity-75 px-2 py-0 me-1 mb-1 text-s text-break text-center"
      style={{ backgroundColor: useBgColor, color: useTxtColor }}
    >
      {props.icon && <i className={props.icon + " bi me-1"}></i>}
      {props.text}
    </span>
  );
};

export default Tag;
