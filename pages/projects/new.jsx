import { CgClose } from 'react-icons/cg'

import client from "@/api/client";
import Metas from "@/components/Metas";
import AuthBox from "@/containers/Auth/AuthBox";
import { useState } from "react";
import Link from 'next/link';
import DragAndDrop from '@/components/DragAndDrop/DragAndDrop';
import { isValidURL, somethingLoading } from '@/helpers';
import ButtonContent from '@/components/ButtonContent';
import { useRouter } from 'next/router';


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

  const router = useRouter()

  const [fastSignOn, setFastSignOn] = useState(false)
  const [fastUser, setFastUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userTag: "",
    emailOk: null,
    loading: false,
    status: ""
  })
  
  const [process, setProcess] = useState({
    loading: false,
    status: ""
  })
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(0)
  const [project, setProject] = useState({
    name: "",
    private: false
  })

  const [product, setProduct] = useState({
    title: "",
    description: "",
    // source: "",
    realUnitValue: NaN,
    projectUnitValue: NaN,
    url: "",
    quantity: NaN
  })
  const [urlOk, setUrlOk] = useState(null)
  const [projectValueOk, setProjectValueOk] = useState(null)

  function handleProjectDef(e){
    e.preventDefault();

    // checking fields values
    if(project.name.trim() !== "") {
      // taking user identity
      const user = localStorage.getItem("revenge-user");

      // checking if user exists
      if(user) {
        setStep(1)
      } else {
        setFastSignOn(true)
      }
    } else {
      alert("Veuillez remplir le nom de votre projet !");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prod) => ({ ...prod, [name]: value }));
  }

  function handleChangeUser(e) {
    const { name, value } = e.target;
    setFastUser((prod) => ({ ...prod, [name]: value.trim() }));
  }

  function checkFieldUniq(e, fieldChecker, string) {
    const {name, value} = e.target
    console.log({e})
    console.log({name})

    value && value !== "" && value !== NaN &&
    client.fetch(
      `
        * [_type == "seller" && ${name} == ${string ? `"${value}"` : parseInt(value)}]{
          ${name}
        }
      `
    )
      .then((resp) => {
        console.log(resp, value)
        if(resp.length > 0)
          {
            setFastUser((user) => ({ ...user, [fieldChecker]: false }))
            return false
          } else {
            setFastUser((user) => ({ ...user, [fieldChecker]: true }))
            return true
          }
        })
        .catch((error) => {
          console.log({ error })
        })
  }

  function checkFields(object) {
    let entries = Object.entries(object)

    let result = true
    entries.map((entry) => {
      if (entry[1] === "") {
        result = false;
      }
    })

    result === false && alert("Tous les champs sont obligatoires")
    return result
  }

  function setTag(email){
    const name = email.split("@")[0]
    const client = (email.split("@")[1]).split(".")[0];
    const ext = email.split(".")[1]

    function encryptMail(str){
      let result = ""

      switch (str) {
        case "gmail":
          result = "5ds45s"; 
          break;
        case "yahoo":
          result = "dsf2sdf";
          break;
        default:
          result = client;
          break;
      }

      return result
    }

    function encryptExt(str){
      let result = ""

      switch (str) {
        case "com":
          result = "564sd2"; 
          break;
        case "fr":
          result = "sdf541";
          break;
        default:
          result = ext;
          break;
      }

      return result
    }

    const tag = `@${name}-${encryptExt(ext)}${encryptMail(client)}`;
    setFastUser((user) => ({ ...user, userTag: tag }))
    return tag;
  }

  async function handleFastSign(e) {
    e.preventDefault();
    if(!fastUser.loading){
      setFastUser((user) => ({ ...user, loading: true, status: "pending" }))
      const { firstName, lastName, email, password } = fastUser
  
      if(checkFields({
        firstName, lastName, email, password
      })) {
          if (
            fastUser.emailOk
          ) {
            let tag = setTag(email);
            try {
              const resp = await client.create(
                {
                  _type: "seller",
                  firstName,
                  lastName,
                  email,
                  password,
                  userTag: tag,
                  confirmed: false,
                  verified: false
                }
              )
              if (resp) {
                let rbUser = {
                  email: resp.email,
                  firstName: resp.firstName,
                  confirmed: resp.confirmed,
                  verified: resp.verified,
                  userTag: resp.userTag,
                }
                localStorage.setItem("revenge-user", JSON.stringify(rbUser));
                alert(`Salut ${resp.firstName} !\nCompte créé avec succès`);
                setFastUser((user) => ({ ...user, choseloading: false, status: "succeed" }))
                setFastSignOn(false)
                setStep(1)
              }
            } catch (error) {
              setFastUser((user) => ({ ...user, loading: false, status: "failed" }))
              alert("Une erreur s'est produite lors de la création de votre compte !")
              console.log({ error })
            }
          }
      } else {
        setFastUser((user) => ({ ...user, loading: false, status: "failed" }))
        alert("Veuillez remplir toutes les informations demandées !")
      }
    } else {
      alert("Enregistrement en cours, merci de patienter !")
    }
  }

  function checkProjectValue(){
    const result = product.realUnitValue > product.projectUnitValue
    setProjectValueOk(result)
    return result
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if(!process.loading){
      setProcess({ loading: true, status: "pending" })
      const rbUser = JSON.parse(localStorage?.getItem("revenge-user"));
      console.log({product})
  
      const confirmed = rbUser.confirmed ? true : false
  
      if(
        product.description !== "" &&
        product.realUnitValue !== NaN &&
        product.projectUnitValue !== NaN &&
        product.quantity !== NaN &&
        checkProjectValue()
      ){
        try {
          const user = await client.fetch(
            `
              * [_type == "seller" && email == "${rbUser.email}"]{
                _id
              }
            `
          );
  
          if(user[0]._id) {
            console.log(user[0]._id);
            try {
              const newProject = await client.create(
                {
                  _type: "project",
                  creator: {
                    _type: 'reference',
                    _ref: user[0]._id
                  },
                  ...project,
                  accepted: confirmed,
                  status: "active"
                }
              )
              if (newProject) {
                console.log({newProject})
                if(file){
                  client.assets
                  .upload('image', file, {
                    contentType: file.type,
                    filename: file.name
                  })
                  .then(async function(imageAsset){
                    try {
                      const newProduct = await client.create(
                        {
                          _type: "product",
                          project: {
                            _type: 'reference',
                            _ref: newProject._id
                          },
                          title: product.title.trim(),
                          description: product.description.trim(),
                          realUnitValue: parseFloat(product.realUnitValue),
                          projectUnitValue: parseFloat(product.projectUnitValue),
                          url: product.url.trim(),
                          quantity: parseInt(product.quantity),
                          discount: 0,
                          image: {
                            _type: 'image',
                            asset: {
                              _type: "reference",
                              _ref: imageAsset?._id
                            }
                          }
                        }
                      )
                      if(newProduct) {
                        console.log({newProduct});
                        setProcess({ loading: false, status: "succeed" })
                        router.push(`/projects/${newProject._id}`);
                      }
                    } catch (error) {
                      setProcess({ loading: false, status: "failed" })
                      alert("Une erreur est survenue lors de l'ajout du produit.\nVeuillez réessayer plus tard ou vérifier vos informations !");
                      console.log("prod pb")
                    }
                  })
                } else {
                  setProcess({ loading: false, status: "failed" })
                  alert("L'image est obligatoire !")
                }
              } else {
                setProcess({ loading: false, status: "failed" })
                alert("Une erreur est survenue lors de la création du projet")
              }
            } catch (error) {
              setProcess({ loading: false, status: "failed" })
              alert("Une erreur s'est produite lors de l'initialisation du projet !")
              console.log({ error })
              console.log("proj pb")
            }
          }
  
        } catch(error) {
          setProcess({ loading: false, status: "failed" })
          console.log({error});
          console.log("user pb");
        }
  
        // alert("Cette fonctinnalité n'est pas encore complète. \nDate maximale prévue de complétion : 06 Avril 2023 !\nMerci d'utiliser Revenge !")
      } else {
        setProcess({ loading: false, status: "failed" })
        alert("Aucun champ ne doit être vide !")
      }
    } else {
      somethingLoading();
    }
  }

  return (
    <div className="page">
      <Metas title={metas.title} metas={metas.metas} />
      <main className="section">
        {
          fastSignOn && <div className="popup">
            <div className="popup-header">
              <div></div>
              <CgClose onClick={() => setFastSignOn(false)} />
            </div>
            <div className="popup-box">
              <h4>Vous n&apos;êtes pas connecté !</h4>
              <p>Créez un compte en 30 secondes avant de continuer !</p>
              <form onSubmit={handleFastSign}>
                <input type="text" className="input input-set" name="firstName" value={fastUser.firstName} onChange={handleChangeUser} placeholder="Prénom" />
                <input type="text" className="input input-set" name="lastName" value={fastUser.lastName} onChange={handleChangeUser} placeholder="Nom" />

                <input type="text" onBlur={(e) => checkFieldUniq(e, "emailOk", true)} className="input input-set" name="email" value={fastUser.email} onChange={handleChangeUser} placeholder="Email" />
                {fastUser.emailOk === false 
                  ? <p className="field-message">
                      <span className='field-message__wrong'>Cet utilisateur existe déjà !</span>
                    </p> 
                  : fastUser.emailOk === true && 
                    <p className="field-message field-message__right">Email disponible</p>
                }

                <input type="password" className="input input-set" name="password" value={fastUser.password} onChange={handleChangeUser} placeholder="Mot de passe" />

                <button type="submit" className="submit">
                  <ButtonContent
                    loading={fastUser.loading}
                    status={fastUser.status}
                    originalText="Valider"
                  />
                </button>
              </form>
              <Link className="popup-box-footer" href="/auth">J&apos;ai déjà un compte !</Link>
            </div>
          </div>
        }
        <AuthBox
          title="Nouveau Groupage" text="Créez votre groupage en 5 minutes !"
          component={
            <form>
              {
                step === 0 &&
                <section>
                  <div className="form-step-header">
                    <h3><p>01</p><span>(1 min)</span></h3>
                    <p>Définissez votre groupage</p>
                  </div>

                  <div>
                    <div className="input-set">
                      <label htmlFor="name">Nom du projet :</label>
                      <input value={project.name} onChange={(e) => setProject((proj) => ({ ...proj, name: e.target.value }))} id="name" className="input" type="text" placeholder="Nommez votre projet" />
                    </div>

                    {/* <div className="input-set">
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
                    </div> */}

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
                        placeholder="Nommez votre produit"
                        value={product.title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-set">
                      <DragAndDrop
                        file={file}
                        setFile={setFile}
                        title="Photo de produit"
                        text="En choisissant cette image, vous assumez qu'il s'agit bien de celle de votre produit, soit que vous détenez, soit que vous avez repéré sur une plateforme de vente populaire !"
                      />
                    </div>

                    <div className="input-set">
                      <label htmlFor="description">Description du produit :</label>
                      <textarea 
                        name="description" 
                        id="description" 
                        className="input" 
                        type="text" 
                        placeholder="Décrivez votre produit"
                        value={product.description}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="input-set">
                      <label htmlFor="url">Lien du produit : <span className='optional'>(facultatif)</span></label>
                      <p>Vos clients pourront vérifier les informations de produit.</p>
                      <input 
                        name="url" 
                        id="url" 
                        className="input" 
                        type="url" 
                        placeholder="https://..."
                        value={product.url}
                        onChange={handleChange}
                        onBlur={(e) => {
                          e.target.value.trim() !== ""
                          ? setUrlOk(isValidURL(e.target.value))
                          : setUrlOk(null)
                        }}
                        />
                        {urlOk === false 
                          ? <p className="field-message">
                              <span className='field-message__wrong'>Url non valide : </span>
                              Doit être de type &quo;http ou https://blabla.exemple/bla&quote;
                            </p> 
                          : null
                        }
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
                      {projectValueOk === false 
                        ? <p className="field-message">
                            <span className='field-message__wrong'>Valeur non valide : </span>
                            Le prix du projet doit être inférieur au prix réél, c&apos;est là tout l&apos;avantage du groupage. Merci !
                          </p> 
                        : null
                      }
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
                      <button onClick={handleSubmit} className="submit submit__gold">
                        <ButtonContent
                          loading={process?.loading}
                          status={process?.status}
                          originalText="Terminer"
                        />
                      </button>
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