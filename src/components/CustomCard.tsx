const CustomCard = (props: {
  key: number;
  title: string;
  description: string;
}) => {
  return (
    <div key={props.key} className="card">
      <h5 className="card-title">{props.title}</h5>
      <div className="card-body">{props.description}</div>
    </div>
  );
};
export default CustomCard;
