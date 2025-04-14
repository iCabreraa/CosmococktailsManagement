import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCocktailForm from "./CreateCocktailForm";

function AddCocktail() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cocktail-form">
          <Button> Add New Cocktail</Button>
        </Modal.Open>
        <Modal.Window name="cocktail-form">
          <CreateCocktailForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCocktail;

// function AddCocktail() {
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   return (
//     <div>
//       <Button
//         variations="primary"
//         size="medium"
//         onClick={() => setIsOpenModal((show) => !show)}
//       >
//         {" "}
//         Add new Cocktail
//       </Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <CreateCocktailForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

// export default AddCocktail;
