import BoxOne from '@/components/BoxOne'
import style from './Steps.module.css'

export default function Steps() {
  const buttons = [
    {
      type: 'link',
      link: "/auth",
      text: "M'inscrire !"
    },
    {
      type: 'link',
      link: "/projects/new",
      text: "Lancer un groupage !"
    },
    {
      type: 'action',
      onClick: function(router, SetUser){
        const user = JSON.parse(localStorage.getItem('revenge-user'));
  
        if(user !== null) {
          SetUser(user);
          router.push(`/account?tag=${user.userTag}`);
        } else {
          router.push("/auth");
        }
      },
      text: "Mon Profile !"
    }
  ]
  
  return (
    <div id="steps" className={style.steps}>
      <h3>Les étapes</h3>
      <h4>Gagnes <b>plus de clients</b> et <b>plus de temps</b> en <b>3 petites étapes</b> !</h4>

      <div className={`flexed ${style.stepsList}`}>
        <BoxOne 
          title="Inscris toi !"
          text="Une fois ton compte créé, tu seras contacté, et peut être  admis à créer des groupages. Si tu es un commerçant de confiance 💂🏾‍♀️, ce sera un honneur pour nous de collaborer avec toi 🤝🏾!"
          button={buttons[0]}
        />

        <BoxOne 
          title="Lances des groupages !"
          type="group"
          text="Crées un groupage en quelques minutes 🕐. Notes bien que tes groupages ne seront publiées que si ton compte est confirmé. Ceci pour la sécurité des clients de la plateforme 🔐!"
          button={buttons[1]}
        />

        <BoxOne 
          title="Regroupe tes clients !"
          type="phone"
          text="Maintenant tu sais qui souhaites rejoindre ton groupage, et tu détient également leurs contacts 🤳🏾 ! À toi de jouer 💪🏾!!"
          button={buttons[2]}
        />
      </div>
    </div>
  )
}