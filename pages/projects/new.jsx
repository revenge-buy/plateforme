import client from "@/api/client";
import Metas from "@/components/Metas";
import AuthBox from "@/containers/Auth/AuthBox";
// import Image from "next/image";
import { useState } from "react";
// import Link from "next/link";
// import login from '../../public/login.jpg'

// const user = localStorage.getItem("rb-user");


const metas = {
  title: 'Créer un projet',
  metas: [
    {
      name: "description",
      content: 'Créez un projet en quelques cliques et gérez facilement vos commandes groupés.'
    }
  ]
}

export default function NewProjects() {
  const [step, setStep] = useState(0)

  const [project, setProject] = useState({
    name: "",
    private: false
  })

  const [product, setProduct] = useState({
    title: "",
    // image: "",
    description: "",
    // source: "",
    realUnitValue: NaN,
    projectUnitValue: NaN,
    url: "",
    quantity: NaN
  })

  function handleProjectDef(e){
    e.preventDefault();
    project.name.trim() !== "" ? setStep(1) : alert("Veuillez remplir le nom de votre projet !")
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prod) => ({ ...prod, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // if(
    //   product.description !== "",
    //   product.realUnitValue !== NaN &&
    //   product.projectUnitValue !== NaN &&
    //   product.url !== "" &&
    //   product.quantity !== NaN
    // ) {
      // try {
      //   const resp = await client.create(
      //     {
      //       _type: "product",
      //       email: user.email.trim(),
      //       password: user.password.trim(),
      //       firstName: user.firstName.trim(),
      //       lastName: user.lastName.trim(),
      //       phone: parseInt(user.phone),
      //       userTag: user.userTag.trim()
      //     }
      //   )
      //   if (resp) {
      //     let rbUser = {
      //       email: resp.email,
      //       firstName: resp.firstName
      //     } 
      //     localStorage.setItem("rb-user", JSON.stringify(rbUser));
      //     router.push("/projects");
      //   }
      // } catch (error) {
      //   alert("Une erreur s'est produite lors de la création de votre compte !")
      //   console.log({ error })
      // }
      alert("Cette fonctinnalité n'est pas encore complète. \nDate maximale prévue de complétion : 06 Avril 2023 !\nMerci d'utiliser Revenge !")
    // } else {
    //   alert("Aucun champ ne doit être vide, et les valeurs numériques ne doivent pas être nulles ( > 0  )!")
    // }
  }

  return (
    <div className="page">
      <Metas title={metas.title} metas={metas.metas} />
      <main className="section">
        <AuthBox
          title="Nouveau Projet" text="Créez votre projet de groupage en 5 minutes !"
          component={
            <form>
              {
                step === 0 &&
                <section>
                  <div className="form-step-header">
                    <h3><p>01</p><span>(1 min)</span></h3>
                    <p>Définissez votre Projet</p>
                  </div>

                  <div>
                    <div className="input-set">
                      <label htmlFor="name">Nom du projet :</label>
                      <input value={project.name} onChange={(e) => setProject((proj) => ({ ...proj, name: e.target.value }))} id="name" className="input" type="text" placeholder="Nommez votre projet" />
                    </div>

                    <div className="input-set">
                      <div className="flexed">
                        <label htmlFor="">Privé</label>
                        <div 
                          onClick={() => setProject((proj) => ({ ...proj, private: !proj.private }))} 
                          className={`input-toggler ${project.private && "input-toggler__active"}`}
                        >
                          <span></span>
                        </div>
                      </div>
                      <p>En mode privé, seuls ceux que vous décidez verront votre projet.</p>
                    </div>

                    <button onClick={handleProjectDef} className="submit">Suivant</button>
                  </div>
                </section>
              }

              {
                step === 1 &&
                <section>
                  <div className="form-step-header">
                    <h3><p>02</p><span>(3,5 min)</span></h3>
                    <p>Ajoutez un produit</p>
                  </div>

                  <div>
                    <div className="input-set">
                      <label htmlFor="title">Titre du produit :</label>
                      <input 
                        name="title" 
                        id="title" 
                        className="input" 
                        type="text" 
                        placeholder="Nommez votre projet"
                        value={product.title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-set">
                      <label htmlFor="description">Description du produit :</label>
                      <textarea 
                        name="description" 
                        id="description" 
                        className="input" 
                        type="text" 
                        placeholder="Décrivez votre projet"
                        value={product.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-set">
                      <label htmlFor="real-unit-value">Prix unitaire :</label>
                      <input 
                        name="realUnitValue" 
                        id="real-unit-value" 
                        className="input" 
                        type="number" 
                        min={1}
                        placeholder="Valeur unitaire réelle"
                        value={product.realUnitValue}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-set">
                      <label htmlFor="projectUnitValue">Prix unitaire du groupage :</label>
                      <input 
                        name="projectUnitValue" 
                        id="projectUnitValue" 
                        className="input" 
                        type="number" 
                        min={1}
                        placeholder="Le prix obtenue grace au groupage"
                        value={product.projectUnitValue}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-set">
                      <label htmlFor="projectUnitValue">Objectif du projet :</label>
                      <input 
                        name="quantity" 
                        id="quantity"
                        className="input" 
                        type="number" 
                        min={1}
                        placeholder="Quantité totale minimum"
                        value={product.quantity}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <button onClick={() => setStep(0)} className="submit">Retour</button>
                      <button onClick={handleSubmit} className="submit submit__gold">Terminer</button>
                    </div>
                  </div>
                </section>
              }
            </form>
          } />
      </main>
    </div>
  )
}