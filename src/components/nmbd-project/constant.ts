export type club = {
    value: string
    label: string
    image?: string
  }
  
 export const clubs: club[] = [
    {
      value: "الامانة العامة",
      label: "الامانة العامة",
      image: "/author/nmbd.png"
    },
    {
      value: "الامانة السياسية",
      label: "الامانة السياسية",
      image: "/author/almgdad.png"
    },
    {
      value: "امانة المجتمع",
      label: "امانة المجتمع",
      image: "/author/hesham.png"
    },
    {
      value: "امانة الاعلام",
      label: "امانة الاعلام",
      image: "/author/gasm.png"
    },
    {
      value: "امانة الطلاب",
      label: "امانة الطلاب",
      image: "/author/hesham.png"
    },
  ]

  export type status = {
    value: string
    label: string
    image?: string
  }
  
 export const statuses: status[] = [
    {
      value: "جاري",
      label: "جاري",
      
    },
    {
      value: "متوقف",
      label: "متوقف",
     
    },
    {
      value: "تم",
      label: "تم",
    },
    {
      value: "محايد",
      label: "محايد",
    },
  ]

  export type priority = {
    value: string
    label: string
    image?: string
  }
  
 export const priorities: priority[] = [
    {
      value: "عالي",
      label: "عالي",
      
    },
    {
      value: "متوسط",
      label: "متوسط",
     
    },
    {
      value: "منخفض",
      label: "منخفض",
    },
    {
      value: "محايد",
      label: "محايد",
    },
  ]