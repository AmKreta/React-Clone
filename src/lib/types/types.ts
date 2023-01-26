export interface PROPS{
    children:DICE_ELEMENT[];
    [key: string]: any;
};

export interface DICE_ELEMENT {
  type: 'TEXT_ELELENT' |  string;
  props: PROPS;
};

export interface FIBER {
  type:string | Function;
  parent: FIBER | null;
  child:FIBER | null;
  sibling: FIBER | null;
  dom:HTMLElement | Text;
  props:PROPS;
  alternate:FIBER | null;
  effectTag:'UPDATE' | 'PLACEMENT' | 'DELETION';
};
