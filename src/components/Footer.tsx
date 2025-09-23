import { selectAllLinks } from "../features/slices/WikiLinkSlice";

const Footer = () => {
  const linksArr = selectAllLinks();
  return (
    <div className=" container-fluid position-fixed bottom-0 start-0 bg-light border-top border-dark">
      <div className="row d-flex flex-wrap">
        {linksArr.map((link) => (
          <div key={link.site} className="col ">
            <div className="text-nowrap">
              <a href={link.url}>{link.site}</a>
            </div>
            <small className="d-none d-lg-block">{link.description}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
