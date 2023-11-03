import { useState } from "react";
import useIncomes from "../hooks/useIncomes";
import "./incomes.css";
import {
  createIncome,
  deleteIncome,
  getIncomes,
  updateIncome,
} from "../services";
import { useForm } from "react-hook-form";
import usePointsOfSale from "../hooks/usePointsOfSale";
import { uploadIncomeFile } from "../services/incomesService";

function Incomes() {
  const { incomes, setIncomes, error, loading } = useIncomes();
  const { points, setPoints } = usePointsOfSale();

  const [desde, setDesde] = useState();
  const [hasta, setHasta] = useState();
  const [puntosVenta, setPuntosVenta] = useState("");
  const [viewInsertIncome, setViewInsertIncome] = useState(false);
  const [idPuntoVenta, setIdPuntoVenta] = useState();
  const [amount, setAmount] = useState();
  const [type, setType] = useState();
  const [concept, setConcept] = useState("");
  const [fileId, setFileId] = useState();
  const [fileName, setFileName] = useState("");
  const [viewFileModal, setViewFileModal] = useState(false);
  const [viewEditModal, setViewEditModal] = useState(false);

  const [editPoint, setEditPoint] = useState();
  const [editPointName, setEditPointName] = useState();
  const [editAmount, setEditAmount] = useState();
  const [editType, setEditType] = useState();
  const [editConcept, setEditConcept] = useState();
  const [editId, setEditId] = useState();
  const [deleteId, setDeleteId] = useState();
  const [deleteIdName, setDeleteIdName] = useState();
  const [tipo, setTipo] = useState("");

  const [errorText, setErrorText] = useState();

  const [deleteModal, setDeleteModal] = useState(false);

  const [totalFiltrado, setTotalFiltrado] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const pointsOrdered = points.sort(function (a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  incomes.sort((a, b) => {
    /* const date1 = new Date(a.date);
    const date2 = new Date(b.date);
    return date2.getTime() - date1.getTime(); */
    return b.id - a.id;
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const formJson = Object.fromEntries(formData.entries());

    try {
      const { idPuntoVenta, amount, type, concept } = data;

      const created = await createIncome(idPuntoVenta, amount, type, concept);

      const allIncomes = await getIncomes();

      setIncomes(allIncomes);

      reset();

      setTimeout(() => {
        setViewInsertIncome(false);
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };

  const buscarRangoFecha = async (e) => {
    e.preventDefault();

    const allIncomes = await getIncomes();
    console.log(allIncomes);

    const filtered = allIncomes
      .filter((element) => {
        return element.idPointsOfSale == puntosVenta;
      })
      .filter((element) => {
        if (tipo != "") {
          return element.type == tipo;
        } else {
          return element;
        }
      });
    if (puntosVenta !== "") {
      setIncomes(
        filtered.filter((element) => {
          const dateDesde = new Date(e.target.desde.value);
          const dateHasta = new Date(e.target.hasta.value);

          const dateElement = new Date(element.date);

          return (
            dateElement.getTime() > dateDesde.getTime() - 86401 &&
            dateElement.getTime() < dateHasta.getTime() + 86400
          );
        })
      );
      const totalIngresos = filtered
        .filter((element) => {
          const dateDesde = new Date(e.target.desde.value);
          const dateHasta = new Date(e.target.hasta.value);

          const dateElement = new Date(element.date);

          return (
            dateElement.getTime() > dateDesde.getTime() - 86401 &&
            dateElement.getTime() < dateHasta.getTime() + 86400
          );
        })
        .reduce((acumulador, numero) => {
          return acumulador + parseFloat(numero.amount);
        }, 0);

      setTotalFiltrado(
        new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(totalIngresos)
      );
    } else {
      const allIncomes = await getIncomes();

      const filtered = allIncomes.filter((element) => {
        if (tipo != "") {
          return element.type == tipo;
        } else {
          return element;
        }
      });
      setIncomes(
        filtered.filter((element) => {
          const dateDesde = new Date(e.target.desde.value);
          const dateHasta = new Date(e.target.hasta.value);

          const dateElement = new Date(element.date);

          return (
            dateElement.getTime() > dateDesde.getTime() - 86401 &&
            dateElement.getTime() < dateHasta.getTime() + 86400
          );
        })
      );
      const totalIngresos = filtered
        .filter((element) => {
          const dateDesde = new Date(e.target.desde.value);
          const dateHasta = new Date(e.target.hasta.value);

          const dateElement = new Date(element.date);

          return (
            dateElement.getTime() > dateDesde.getTime() - 86401 &&
            dateElement.getTime() < dateHasta.getTime() + 86400
          );
        })
        .reduce((acumulador, numero) => {
          return acumulador + parseFloat(numero.amount);
        }, 0);

      setTotalFiltrado(
        new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(totalIngresos)
      );
    }
  };

  const handleOnChangeSearchPointOfSale = (e) => {
    setPuntosVenta(e.target.value);
  };

  const createNewIncome = () => {
    setViewInsertIncome(true);
  };

  const handleOnChangeIdPuntoVenta = (e) => {
    setIdPuntoVenta(e.target.value);
  };
  const handleOnChangeTipo = (e) => {
    setTipo(e.target.value);
  };

  const handleOnChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleOnChangeType = (e) => {
    setType(e.target.value);
  };
  const handleOnChangeConcept = (e) => {
    setConcept(e.target.value);
  };

  const handleOnChangeFileName = (e) => {
    setFileName(e.target.value);
  };

  const handleOnChangeEditPoint = (e) => {
    setEditPointName(e.target.value);
    const elemento = points.filter((element) => {
      return element.name === e.target.value;
    });

    setEditPoint(elemento[0].ID);
  };

  const handleOnChangeEditAmount = (e) => {
    setEditAmount(e.target.value);
  };

  const handleOnChangeEditType = (e) => {
    setEditType(e.target.value);
  };

  const handleOnChangeEditConcept = (e) => {
    setEditConcept(e.target.value);
  };

  const deleteIncomeFunction = async () => {
    try {
      const deleted = await deleteIncome(deleteId);

      setIncomes(
        incomes.filter((element) => {
          return element.id !== deleteId;
        })
      );
      setDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const editSave = async (e) => {
    e.preventDefault();
    try {
      const edited = await updateIncome(
        editPoint,
        e.target.editAmount.value,
        e.target.editType.value,
        e.target.editConcept.value,
        editId
      );

      setIncomes(await getIncomes());
      setViewEditModal(false);
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const uploadDocument = (element) => {
    setViewFileModal(true);
    setFileId(element.id);
  };

  const edit = (element) => {
    setEditId(element.id);
    setEditPoint(element.idPointsOfSale);
    setEditPointName(element.name);
    setEditAmount(element.amount);
    setEditType(element.type);
    setEditConcept(element.concept);
    setViewEditModal(true);
  };

  const cargarArchivo = async (event) => {
    event.preventDefault();

    try {
      const archivo = event.target[0].files[0];
      const formData = new FormData();
      formData.append("avatar", archivo);
      const datos = await uploadIncomeFile(formData, fileId);

      const date = new Date();

      const arr = fileName.split("\\");

      setTimeout(async () => {
        const data = await getIncomes();
        setViewFileModal(false);
        setIncomes(data);
      }, 800);
      /* setViewFileModal(false); */
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    return <h1>{error.message}</h1>;
  } else {
    return (
      <div className="incomes-container">
        <div className="filtros-container">
          <form
            onSubmit={(event) => {
              buscarRangoFecha(event);
            }}
          >
            <div className="filtros-fecha-container">
              <label>Desde</label>
              <input
                type="date"
                defaultValue={desde}
                name="desde"
                className="input-date"
              />
              <label>Hasta</label>

              <input
                type="date"
                defaultValue={hasta}
                name="hasta"
                className="input-date"
              />
            </div>

            <div>
              <select
                className="input-search-estado"
                name="idPuntoVenta"
                id="lang"
                onChange={handleOnChangeSearchPointOfSale}
                value={puntosVenta}
              >
                <option value="">Punto de Venta (Todos)</option>

                {pointsOrdered.map((element, index) => {
                  return (
                    <option value={element.ID} key={index}>
                      {element.name}
                    </option>
                  );
                })}
              </select>

              <select
                className="input-search-estado"
                name="idPuntoVenta"
                id="lang"
                onChange={handleOnChangeTipo}
                value={tipo}
              >
                <option value="">Metodo Pago (Todos)</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
              <button type="submit" className="points-lupa-btn"></button>
            </div>
          </form>
        </div>
        <div className="crearNuevo-container">
          <button
            onClick={() => createNewIncome()}
            className="points-btn-crear"
          >
            NUEVO INGRESO
          </button>
        </div>

        <div className="ingresos-total-filtrado">{totalFiltrado}</div>

        {viewInsertIncome && (
          <div className="incomes-modal-container">
            <div className="incomes-modal">
              <form
                className="incomes-form-container"
                method="post"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="modal-selects-container">
                  <div className="inputs-container">
                    <select
                      name="idPuntoVenta"
                      id="lang"
                      onChange={handleOnChangeIdPuntoVenta}
                      value={idPuntoVenta}
                      {...register("idPuntoVenta", {
                        required: true,
                      })}
                    >
                      <option value="">Punto de Venta</option>

                      {pointsOrdered.map((element, index) => {
                        return (
                          <option value={element.ID} key={index}>
                            {element.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.idPuntoVenta?.type === "required" && (
                      <span>Campo requerido</span>
                    )}
                  </div>

                  <div className="inputs-container">
                    <select
                      name="type"
                      id="lang"
                      onChange={handleOnChangeType}
                      value={type}
                      {...register("type", {
                        required: true,
                      })}
                    >
                      <option value="">Metodo de pago</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                    {errors.type?.type === "required" && (
                      <span>Campo requerido</span>
                    )}
                  </div>
                </div>

                <input
                  type="number"
                  step="any"
                  id="amount"
                  defaultValue={amount}
                  placeholder="Importe"
                  onChange={handleOnChangeAmount}
                  {...register("amount", {
                    required: true,
                  })}
                />
                {errors.amount?.type === "required" && (
                  <span>Campo requerido</span>
                )}

                <input
                  type="text"
                  id="concept"
                  defaultValue={concept}
                  placeholder="Concepto"
                  onChange={handleOnChangeConcept}
                  {...register("concept", {
                    required: true,
                  })}
                />
                {errors.concept?.type === "required" && (
                  <span>Campo requerido</span>
                )}
                <div className="modal-actions">
                  <button type="submit">CREAR</button>
                  <button
                    type="submit"
                    onClick={() => setViewInsertIncome(false)}
                  >
                    CANCELAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="incomes-content-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Punto de venta</th>
                <th>Metodo de pago</th>
                <th>Concepto</th>
                <th>Importe</th>
                <th>Document</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {incomes.map((element) => {
                const date = new Date(element.date);
                return (
                  <tr key={element.id}>
                    <td>{`${date.getDate()}/${
                      date.getMonth() + 1
                    }/${date.getFullYear()}`}</td>
                    <td>{element.name}</td>
                    <td>{element.type}</td>
                    <td>{element.concept}</td>
                    <td>
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(element.amount)}
                    </td>
                    <td>
                      {
                        /* {element.document} */ <a
                          href={`${import.meta.env.VITE_ARCHIVOS_URL}/${
                            import.meta.env.VITE_ARCHIVOS_CONTAINER_NAME
                          }/${element.document}`}
                          download="archivo.txt"
                        >
                          {element.document}
                        </a>
                      }
                    </td>

                    <td>
                      <button
                        onClick={() => uploadDocument(element)}
                        className="incomes-btn-upload"
                      ></button>
                      <button
                        onClick={() => edit(element)}
                        className="points-btn-editar"
                      ></button>
                      <button
                        onClick={() => {
                          setDeleteModal(true);
                          setDeleteId(element.id);
                          setDeleteIdName({
                            name: element.name,
                            amount: element.amount,
                          });
                        }}
                        className="providers-btn-eliminar"
                      ></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {viewFileModal && (
          <div className="uploadFile-modal-container">
            <div className="uploadFile-modal">
              <form
                onSubmit={(event) => cargarArchivo(event)}
                /* action={`${
                  import.meta.env.VITE_BACKEND_URL
                }/incomes/files/${fileId}`}
                target="_blank"
                method="post"
                encType="multipart/form-data" */
              >
                <input
                  type="file"
                  name="avatar"
                  id=""
                  /* defaultValue={fileName} */
                  onChange={handleOnChangeFileName}
                />
                <div className="modal-actions">
                  <button type="submit">ENVIAR</button>
                  <button type="button" onClick={() => setViewFileModal(false)}>
                    CANCELAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {viewEditModal && (
          <div className="edit-modal-container">
            <div className="edit-modal">
              <form
                className="incomes-form-container"
                method="post"
                onSubmit={(event) => editSave(event)}
              >
                <select
                  name="editIdPoint"
                  id="lang"
                  onChange={handleOnChangeEditPoint}
                  defaultValue={editPointName}
                >
                  {pointsOrdered.map((element, index) => {
                    return (
                      <option defaultValue={element.ID} key={index}>
                        {element.name}
                      </option>
                    );
                  })}
                </select>

                <select
                  name="editType"
                  id="lang"
                  onChange={handleOnChangeEditType}
                  defaultValue={editType}
                >
                  <option value="">Metodo de pago</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>

                <input
                  name="editConcept"
                  type="text"
                  id="concept"
                  defaultValue={editConcept}
                  placeholder="Concepto"
                  onChange={handleOnChangeEditConcept}
                />

                <input
                  name="editAmount"
                  type="number"
                  step="any"
                  id="amount"
                  defaultValue={editAmount}
                  placeholder="Importe"
                  onChange={handleOnChangeEditAmount}
                />
                {errorText && <span>{errorText}</span>}
                <div className="modal-actions">
                  <button type="submit">GUARDAR</button>
                  <button type="button" onClick={() => setViewEditModal(false)}>
                    CANCELAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {deleteModal && (
          <div className="income-delete-modal-container">
            <div className="income-delete-modal">
              <h2>
                ¿Seguro desea eliminar {deleteIdName.name} por €
                {deleteIdName.amount} ?{" "}
              </h2>
              <div className="modal-actions">
                <button onClick={() => deleteIncomeFunction()}>ACEPTAR</button>
                <button
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Incomes;
