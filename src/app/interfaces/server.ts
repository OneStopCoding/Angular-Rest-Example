import {Status} from "../enums/status.enum";
import {Type} from "../enums/type.enum";

export interface Server{
   id: number;
   ipAddress: string;
   name : string;
   memory: string;
   status: Status;
   type: Type;
   imageUrl: string;
}
