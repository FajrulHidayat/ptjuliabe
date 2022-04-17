  
const tanggal= (date) => {
    const d = new Date(date);
    const dtf = new Intl.DateTimeFormat("en", {
      year: "numeric",
    //   month: "long",
      month: "2-digit",
      day: "2-digit",
    });
  
    const [{ value: mo }, , { value: da }, , { value: year }] = dtf.formatToParts(
      d
    );
  
    return `${year}-${mo}-${da}`;
  };
  module.exports=tanggal
// export default (date) => {
//     const d = new Date(date)

// }