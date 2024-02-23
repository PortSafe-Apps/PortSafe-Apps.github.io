window.addEventListener('DOMContentLoaded', event => {

    const litepickerSingleDate = document.getElementById('litepickerSingleDate');
    if (litepickerSingleDate) {
        new Litepicker({
            element: litepickerSingleDate,
            format: 'MMM DD, YYYY'
        });
    }

    const litepickerDateRange = document.getElementById('litepickerDateRange');
    if (litepickerDateRange) {
        new Litepicker({
            element: litepickerDateRange,
            singleMode: false,
            format: 'MMM DD, YYYY'
        });
    }

    const litepickerDateRange2Months = document.getElementById('litepickerDateRange2Months');
    if (litepickerDateRange2Months) {
        new Litepicker({
            element: litepickerDateRange2Months,
            singleMode: false,
            numberOfMonths: 2,
            numberOfColumns: 2,
            format: 'MMM DD, YYYY'
        });
    }

    // const litepickerRangePlugin = document.getElementById('litepickerRangePlugin');
    // if (litepickerRangePlugin) {
    //     new Litepicker({
    //         element: litepickerRangePlugin,
    //         startDate: new Date(),
    //         endDate: new Date(),
    //         singleMode: false,
    //         numberOfMonths: 2,
    //         numberOfColumns: 2,
    //         format: 'MMM DD, YYYY',
    //         plugins: ['ranges']
    //     });
    // }

    const dynamicDateTimeElement = document.getElementById('dynamicDateTime');
    // Fungsi untuk memperbarui tanggal dan waktu
    function updateDateTime() {
        // Mendapatkan waktu saat ini
        const currentTime = new Date();

        // Format tanggal dan waktu
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric', 
            timeZoneName: 'short' 
        };

        // Membuat string tanggal dan waktu
        const dateTimeString = currentTime.toLocaleDateString('en-US', options);

        // Menetapkan string tanggal dan waktu ke elemen span
        dynamicDateTimeElement.innerHTML = dateTimeString;
    }
    updateDateTime();

    setInterval(updateDateTime, 1000);
});
