import { selectAllLinks } from "../api/wiki-links";
import { textIcon } from "../app/icons/common";

const Footer = () => {
    const footerClasses =
        "container-fluid z-2 position-fixed bottom-0 start-0 bg-dark border-top border-dark text-center";
    const { data: linksArr, isLoading, isError, error } = selectAllLinks();

    if (isLoading) {
        return (
            <div className={footerClasses}>
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={footerClasses}>
                <div className="text-danger">Error loading data: {error.message}</div>
            </div>
        );
    }

    return (
        <div className={footerClasses + "  overflow-x-auto"}>
            <div className="d-flex flex-nowrap text-light text-center">
                {linksArr &&
                    linksArr.map((link) => (
                        <div key={link.site} className="col py-1 align-content-center">
                            <div className="text-s text-nowrap px-3 px-sm-1">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    className="text-decoration-none text-light d-inline-flex align-items-center">
                                    {link.logo ? textIcon(link.logo) : null} {link.site}
                                </a>
                            </div>

                            <div className="text-xs d-none d-lg-block">
                                {link.description ? link.description : null}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Footer;
