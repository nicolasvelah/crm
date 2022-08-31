const toPrint = (template: string) => {
  const mywindow = window.open('', 'PRINT', 'height=1200,width=400')!;

  mywindow.document.write(`<html><head><title>${document.title}</title>`);
  mywindow.document.write(
    '<style>@page { size: 21cm 29.7cm;margin: 1cm 1cm 1cm 1cm; }</style>'
  );
  mywindow.document.write('</head><body >');
  mywindow.document.write(template);
  mywindow.document.write('</body></html>');

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.onload = () => {
    mywindow.print();
  };
};

export default toPrint;
