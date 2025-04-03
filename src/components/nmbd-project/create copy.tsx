// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useProject } from "./context";
// import { useState } from "react";
// import { useUpload } from "@/components/upload/context";
// import SelectPopover from "@/components/atom/popover/popover";
// import { club, clubs } from "./constant";
// import Status from "./status";
// import { Icon } from "@iconify/react";

// interface FormData {
//   title: string;
//   desc: string;
//   club: string;
//   status: string;
// }

// const formSchema = z.object({
//   title: z.string(),
//   desc: z.string(),
//   club: z.string(),
//   status: z.string(),
// });

// interface CreateProps {
//   onClose: () => void;
// }

// const CreateProject: React.FC<CreateProps> = ({ onClose }) => {
//   const { refreshProjects } = useProject();
//   const { image } = useUpload();
//   const [step, setStep] = useState(1);
//   const [selectedClub, setSelectedClub] = useState<club | null>(null);
//   // const [selectedStatus, setSelectedStatus] = useState<status | null>(null);

//   const nextStep = () => setStep(prevStep => (prevStep < 4 ? prevStep + 1 : 4));
//   const prevStep = () => setStep(prevStep => (prevStep > 1 ? prevStep - 1 : 1));

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       desc: "",
//       club: "",
//       status: "",
//     },
//   });

//   const handleSubmit = async (data: FormData) => {
//     console.log("Form submitted", data);

//     const postData = {
//       ...data,
//       club: selectedClub?.value, // Use the value of the selected lead
//       // status: selectedStatus?.value, // Use the value of the selected status
//       status: data.status,
//     };

//     const response = await fetch('/api/project', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(postData),
//     });
//     console.log(response);

//     if (response.ok) {
//       form.reset();
//       setSelectedClub(null);
//       // setSelectedStatus(null); 
//       refreshProjects();
//       onClose();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen ">
//       <div className='felx pl-[30rem] pb-4 flex-col items-start justify-start gap-2'>
//         <h3>مشروع جديد</h3>
//         <p className='text-sm font-light mt-2'>
//         الجزء الاكثر سحرا في كتب هاري بورتر, انهم في الاخير <br/> استعملوا المهارات التي تعلموها في المدرسة
//         </p>
//       </div>
//       <Form  {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleSubmit)}
//           className="w-full max-w-md flex flex-col justify-center items-center gap-6 -mt-28 relative h-full"
//         >
//           <Button
//             type='button'
//             size="icon"
//             variant='outline'
//             className={`absolute top-1/2 left-[-10rem] transform -translate-y-1/2 rounded-full ${step === 1 ? 'opacity-50 pointer-events-none' : ''}`}
//             onClick={prevStep}
//           >
//             <Icon icon="ic:sharp-arrow-back" width={25} />
//           </Button>
//           <Button
//             type='button'
//             size="icon"
//             variant='outline'
//             className={`absolute top-1/2 right-[-10rem] transform -translate-y-1/2 rounded-full ${step === 4 ? 'opacity-50 pointer-events-none' : ''}`}
//             onClick={nextStep}
//           >
//             <Icon icon="ic:sharp-arrow-forward" width={25} />
//           </Button>
//           {step === 1 && (
//             <div className="flex flex-col gap-6">
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input className=" w-72" placeholder="الاسم" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="desc"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input className="h-20 w-72" placeholder="الوصف" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//           )}
//           {step === 2 && (
//             <>
//               <FormField
//                 control={form.control}
//                 name="club"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <SelectPopover
//                         items={clubs}
//                         selectedItem={selectedClub}
//                         setSelectedItem={(item) => {
//                           setSelectedClub(item);
//                           form.setValue("club", item?.value ?? ""); // Update form state with the selected lead value
//                         }}
//                         label="+ الامانة"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </>
//           )}
//           {step === 3 && (
//             <>
//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Status
//                         status={form.watch("status")} // Watch form's status state
//                         setStatus={(status) => form.setValue("status", status)} // Update form state with selected status
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}

//               />
//             </>
//           )}
//           {step === 4 && (
//             <>
//             </>
//           )}
//           <Button
//             type="submit"
//             className="absolute bottom-20 mt-6 h-12 font-medium text-sm w-72"
//           >
//             انشاء مشروع
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default CreateProject;
