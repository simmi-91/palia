const Tag = (props: {
    text: string;
    title?: string;
    href?: string;
    bgColor?: string;
    wrap?: boolean | false;
    icon?: string;
    iconNode?: React.ReactNode;
}) => {
    const defaultBgColor = "#e5e7eb";

    let useBgColor = props.bgColor ? props.bgColor : defaultBgColor;
    let useTxtColor = useBgColor === defaultBgColor ? "#000" : "#fff";
    const wrapClass = props.wrap ? "text-wrap " : "text-nowrap";

    return (
        <span
            title={props.title ? props.title : props.text}
            className={
                `rounded-pill border border-dark-subtle opacity-75 px-2 py-0 me-1 mb-1 text-s d-inline-flex align-items-center ` +
                wrapClass
            }
            style={{ backgroundColor: useBgColor, color: useTxtColor }}>
            {props.icon && <i className={props.icon + " bi me-1"}></i>}
            {props.iconNode && <span className="me-1">{props.iconNode}</span>}
            {props.text}
        </span>
    );
};

export default Tag;
