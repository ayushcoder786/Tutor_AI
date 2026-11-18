import "./ProgressSpinner.css";

const ProgressSpinner = ({value}) => {
    return (
        <div className="spinner-overlay">
            <div className="spinner"></div>
            {value && <span>{value.prog}</span>}
        </div>
    );
}

export default ProgressSpinner;
