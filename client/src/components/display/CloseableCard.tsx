const CloseableCard = (props: {
  key: number;
  title: string;
  description: string;
}) => {
  return (
    <div
      className="offcanvas offcanvas-start"
      id="offcanvas"
      aria-labelledby="offcanvasLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasLabel">
          {props.title}
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">{props.description}</div>
    </div>
  );
};
export default CloseableCard;
