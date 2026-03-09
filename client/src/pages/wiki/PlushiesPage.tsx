import CustomCard from "../../components/display/CustomCard";

import { LoadingState, ErrorState, EmptyCategoryState } from "../../components/CommonStates";

import { selectAllPlushies } from "../../api/plushies";

const PlushiesPage = () => {
    const curCategory = "plushies";

    const { data, isLoading, isError, error } = selectAllPlushies();

    if (isLoading) {
        return <LoadingState color="dark" />;
    }

    if (isError) {
        return <ErrorState error={error} />;
    }

    if (!data || data.length === 0) {
        return <EmptyCategoryState />;
    }

    return (
        <div className="container-fluid ">
            <div className="row d-flex my-1 ">
                <div className="col">
                    <div>Can be traded at booths available in the Underground.</div>
                </div>
            </div>

            <div className="row d-flex g-2 my-2">
                {data &&
                    data.map((item) => (
                        <CustomCard
                            category={curCategory}
                            key={item.id}
                            dataObject={item}
                            isTradeable={true}
                            favoriteId={0}
                        />
                    ))}
            </div>
        </div>
    );
};
export default PlushiesPage;
