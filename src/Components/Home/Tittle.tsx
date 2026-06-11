import './Tittle.scss'

interface TittleProps {
  subTittle: string;
  tittle: string;
}

const Tittle = ({ subTittle, tittle }: TittleProps) => {
  return (
    <div className="tittle">
      <span className="star">✦</span>
      <p>{subTittle}</p>
      <h2>{tittle}</h2>
    </div>
  );
};

export default Tittle;