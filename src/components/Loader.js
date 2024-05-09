import { Spinner } from "react-bootstrap";

const Loader = () => {
    return (
        <div className="text-center my-5">
            <Spinner animation="grow" variant="primary" />
            <p className="my-2">Loading Data...</p>
        </div>
    )
}

export default Loader;