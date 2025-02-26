export type ClsOption = string | null | undefined | false ;
const cls = (...classes: ClsOption[]) => classes.filter(cn => !!cn).join(' ');

export default cls;