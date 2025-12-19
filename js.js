
        //  memastikan bahwa seluruh skrip hanya akan berjalan setelah dokumen HTML selesai dimuat sepenuhnya oleh browser. Ini mencegah error saat mencoba mengakses elemen yang belum ada.
        document.addEventListener('DOMContentLoaded', function() {
            
             // Menunggu hingga seluruh struktur HTML selesai dimuat sebelum menjalankan kode JavaScript di dalamnya.
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc');

    // Mendefinisikan URL gambar placeholder untuk merepresentasikan tiga status kalkulator: Normal, Sukses, dan Error.
    const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
    const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
    const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

    /**
     * Fungsi untuk mengubah gambar status (src dan alt) berdasarkan kondisi kalkulasi saat ini.
     */
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            // Mengembalikan gambar ke status normal (default) jika tidak dalam kondisi sukses atau error.
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**
     * Fungsi untuk menghapus seluruh teks di layar kalkulator dan mereset gambar status ke kondisi normal.
     */
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil function untuk merubah gambar
    }

    /**
     * Fungsi untuk menghapus satu karakter terakhir yang ada pada layar (fitur Backspace).
     */
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**
     * Fungsi untuk menambahkan angka atau operator yang ditekan ke dalam tampilan layar kalkulator.
     */
    function appendToDisplay(value) {
        display.value += value;
    }

    /**
     * Fungsi utama untuk mengevaluasi dan menghitung hasil dari ekspresi matematika yang ada di layar.
     */
    function calculateResult() {
        // Validasi: Jika layar kosong saat tombol sama dengan (=) ditekan, tampilkan pesan error sementara.
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            // Menunggu selama 1.5 detik sebelum menghapus pesan "Kosong!" secara otomatis.
            setTimeout(clearDisplay, 1500);
            return;
        }

        try {
            // Melakukan proses kalkulasi menggunakan fungsi eval().
            let result = eval(display.value
                .replace(/%/g, '/100') // Mengubah simbol persen (%) menjadi pembagian per seratus agar bisa dihitung.
            ); 
            
            // Mengecek apakah hasil kalkulasi adalah angka valid (bukan pembagian nol atau nilai tak terhingga).
            if (isFinite(result)) {
                display.value = result;
                changeImage('success'); // Mengubah gambar status menjadi hijau/sukses setelah berhasil menghitung.
            } else {
                throw new Error("Hasil tidak valid");
            }

        } catch (error) {
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            changeImage('error'); // Mengubah gambar status menjadi merah/error jika terjadi kesalahan penulisan rumus.
            setTimeout(clearDisplay, 1500);
        }
    }


    // Melakukan perulangan pada setiap tombol kalkulator untuk memasangkan fungsi "klik" (event listener).
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            // Mengidentifikasi tindakan yang harus diambil berdasarkan nilai atribut 'data-value' dari tombol.
            switch(value) {
                case 'C':
                    // Memanggil fungsi reset layar jika tombol Clear ditekan.
                    clearDisplay();
                    break;
                case 'DEL':
                    // Memanggil fungsi hapus satu karakter jika tombol Delete ditekan.
                    deleteLastChar();
                    break;
                case '=':
                    // Memanggil fungsi kalkulasi hasil jika tombol sama dengan ditekan.
                    calculateResult();
                    break;
                default:
                    // Jika layar sedang menampilkan hasil sukses atau pesan error, layar akan dihapus otomatis sebelum menulis angka baru.
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(value);
                    break;
            }
        });
    });

    // Menambahkan dukungan input melalui keyboard fisik sehingga user bisa mengetik angka dan operator secara langsung.
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
            e.preventDefault();
        }
    });

});
