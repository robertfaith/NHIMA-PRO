import './Tittle.scss'

interface TittleProps {
  subTittle: string;
  tittle: string;
}

const Tittle = ({ subTittle, tittle }: TittleProps) => {
  return (
    <div className="tittle">
      <svg className="tittle__pulse" viewBox="0 0 120 28" aria-hidden="true">
        <path d="M0 14 H36 L44 4 L54 24 L62 14 L70 20 L78 14 H120" />
      </svg>
      <p>{subTittle}</p>
      <h2>{tittle}</h2>
    </div>
  );
};

export default Tittle;