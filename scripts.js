let array = [];
        let sortPaused = false;
        let currentSortAlgorithm = null;
        let dragIndex = null;

        const displayArray = (highlightedIndices = []) => {
            const display = document.getElementById("array-display");
            display.innerHTML = '';

            array.forEach((value, index) => {
                const elementWrapper = document.createElement("div");
                elementWrapper.className = "array-element";
                if (highlightedIndices.includes(index)) {
                    elementWrapper.classList.add("highlight"); // Add a highlight class
                }
                elementWrapper.draggable = true; // Enable dragging
                elementWrapper.dataset.index = index;

                // Drag event listeners
                elementWrapper.addEventListener("dragstart", (e) => onDragStart(e, index));
                elementWrapper.addEventListener("dragover", (e) => onDragOver(e));
                elementWrapper.addEventListener("dragleave", () => onDragLeave(elementWrapper));
                elementWrapper.addEventListener("drop", (e) => onDrop(e, index));

                const div = document.createElement("div");
                div.innerText = value;

                const indexSpan = document.createElement("span");
                indexSpan.innerText = index;
                indexSpan.className = "index";

                elementWrapper.appendChild(div);
                elementWrapper.appendChild(indexSpan);
                display.appendChild(elementWrapper);
            });
        };

        const onDragStart = (event, index) => {
            dragIndex = index; // Save the index of the dragged element
            event.dataTransfer.effectAllowed = "move";
            event.target.classList.add("dragging");
        };

        const onDragOver = (event) => {
            event.preventDefault(); // Allow dropping
            event.target.closest(".array-element").classList.add("drop-target");
        };

        const onDragLeave = (element) => {
            element.classList.remove("drop-target");
        };

        const onDrop = (event, dropIndex) => {
            event.preventDefault();
            const draggedValue = array[dragIndex];

            // Remove the dragged element
            array.splice(dragIndex, 1);

            // Insert it at the new position
            if (dragIndex < dropIndex) {
                array.splice(dropIndex, 0, draggedValue);
            } else {
                array.splice(dropIndex + 1, 0, draggedValue);
            }

            // Reset styles and re-render the array
            document.querySelectorAll(".drop-target").forEach((el) => el.classList.remove("drop-target"));
            document.querySelectorAll(".dragging").forEach((el) => el.classList.remove("dragging"));
            displayArray();
        };

        const getAnimationSpeed = () => {
            return parseInt(document.getElementById("animation-speed").value);
        };

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const quickSort = async (arr, low = 0, high = arr.length - 1) => {
            if (low < high) {
                const pivotIndex = await partition(arr, low, high);
                await quickSort(arr, low, pivotIndex - 1);
                await quickSort(arr, pivotIndex + 1, high);
            }
        };

        const partition = async (arr, low, high) => {
            const pivot = arr[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    displayArray([i, j]);
                    await delay(getAnimationSpeed());
                    if (sortPaused) await waitForResume();
                }
            }

            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            displayArray([i + 1, high]);
            await delay(getAnimationSpeed());
            if (sortPaused) await waitForResume();
            return i + 1;
        };

        const insertionSort = async () => {
            for (let i = 1; i < array.length; i++) {
                let key = array[i];
                let j = i - 1;
                while (j >= 0 && array[j] > key) {
                    array[j + 1] = array[j];
                    j--;
                    displayArray([j + 1, j]);
                    await delay(getAnimationSpeed());
                    if (sortPaused) await waitForResume();
                }
                array[j + 1] = key;
                displayArray([j + 1]);
                await delay(getAnimationSpeed());
                if (sortPaused) await waitForResume();
            }
        };

        const mergeSort = async (arr = array, start = 0, end = arr.length - 1) => {
            if (start >= end) return;
            const mid = Math.floor((start + end) / 2);
            await mergeSort(arr, start, mid);
            await mergeSort(arr, mid + 1, end);
            await merge(arr, start, mid, end);
        };

        const merge = async (arr, start, mid, end) => {
            const left = arr.slice(start, mid + 1);
            const right = arr.slice(mid + 1, end + 1);
            let i = 0, j = 0, k = start;

            while (i < left.length && j < right.length) {
                if (left[i] <= right[j]) {
                    arr[k] = left[i];
                    i++;
                } else {
                    arr[k] = right[j];
                    j++;
                }
                displayArray([k]);
                await delay(getAnimationSpeed());
                if (sortPaused) await waitForResume();
                k++;
            }

            while (i < left.length) {
                arr[k] = left[i];
                displayArray([k]);
                await delay(getAnimationSpeed());
                if (sortPaused) await waitForResume();
                i++;
                k++;
            }

            while (j < right.length) {
                arr[k] = right[j];
                displayArray([k]);
                await delay(getAnimationSpeed());
                if (sortPaused) await waitForResume();
                j++;
                k++;
            }
        };

        const heapSort = async () => {
            const n = array.length;
            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                await heapify(n, i);
            }

            for (let i = n - 1; i > 0; i--) {
                [array[0], array[i]] = [array[i], array[0]];
                displayArray([0, i]);
                await delay(getAnimationSpeed());
                if (sortPaused) await waitForResume();
                await heapify(i, 0);
            }
        };

        const heapify = async (n, i) => {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && array[left] > array[largest]) {
                largest = left;
            }

            if (right < n && array[right] > array[largest]) {
                largest = right;
            }

            if (largest !== i) {
                [array[i], array[largest]] = [array[largest], array[i]];
                displayArray([i, largest]);
                await delay(getAnimationSpeed());
                if (sortPaused) await waitForResume();
                await heapify(n, largest);
            }
        };

        const sortBubble = async () => {
            for (let i = 0; i < array.length - 1; i++) {
                for (let j = 0; j < array.length - i - 1; j++) {
                    if (array[j] > array[j + 1]) {
                        [array[j], array[j + 1]] = [array[j + 1], array[j]];
                        displayArray([j, j + 1]);
                        await delay(getAnimationSpeed());
                        if (sortPaused) await waitForResume();
                    }
                }
            }
        };

        const sortSelection = async () => {
            for (let i = 0; i < array.length - 1; i++) {
                let minIndex = i;
                for (let j = i + 1; j < array.length; j++) {
                    if (array[j] < array[minIndex]) {
                        minIndex = j;
                    }
                }
                if (minIndex !== i) {
                    [array[i], array[minIndex]] = [array[minIndex], array[i]];
                    displayArray([i, minIndex]);
                    await delay(getAnimationSpeed());
                    if (sortPaused) await waitForResume();
                }
            }
        };

        const waitForResume = () => {
            return new Promise(resolve => {
                const resumeHandler = () => {
                    sortPaused = false;
                    document.getElementById('pause-btn').disabled = false;
                    document.getElementById('resume-btn').disabled = true;
                    document.removeEventListener('resume-sort', resumeHandler);
                    resolve();
                };
                document.addEventListener('resume-sort', resumeHandler);
            });
        };

        const animateSort = async () => {
            const algorithm = document.getElementById("sort-algorithm").value;
            sortPaused = false;
            document.getElementById('pause-btn').disabled = false;
            document.getElementById('resume-btn').disabled = true;

            try {
                switch(algorithm) {
                    case "bubble": await sortBubble(); break;
                    case "selection": await sortSelection(); break;
                    case "quick": await quickSort(array); break;
                    case "insertion": await insertionSort(); break;
                    case "merge": await mergeSort(); break;
                    case "heap": await heapSort(); break;
                }
            } catch (error) {
                console.error("Sort interrupted", error);
            }
        };

        const pauseSort = () => {
            sortPaused = true;
            document.getElementById('pause-btn').disabled = true;
            document.getElementById('resume-btn').disabled = false;
        };

        const resumeSort = () => {
            document.dispatchEvent(new Event('resume-sort'));
        };

        const insertNumber = () => {
            const number = parseInt(document.getElementById("number").value);
            const index = parseInt(document.getElementById("index").value);
            const feedback = document.getElementById("feedback");

            if (!isNaN(number)) {
                if (!isNaN(index) && index >= 0) {
                    array.splice(index, 0, number);
                    feedback.innerText = `Inserted ${number} at index ${index}`;
                } else {
                    array.push(number);
                    feedback.innerText = `Inserted ${number}`;
                }
                displayArray();
            } else {
                feedback.innerText = "Invalid input! Enter a valid number.";
            }
        };

        const removeByIndex = () => {
            const index = parseInt(document.getElementById("index").value);
            const feedback = document.getElementById("feedback");

            if (!isNaN(index) && index >= 0 && index < array.length) {
                const removed = array.splice(index, 1);
                feedback.innerText = `Removed ${removed} from index ${index}`;
                displayArray();
            } else {
                feedback.innerText = "Invalid index!";
            }
        };

        const removeNumber = () => {
            const number = parseInt(document.getElementById("number").value);
            const index = array.indexOf(number);
            const feedback = document.getElementById("feedback");

            if (index !== -1) {
                array.splice(index, 1);
                feedback.innerText = `Removed ${number}`;
                displayArray();
            } else {
                feedback.innerText = `${number} not found in the array.`;
            }
        };

        const updateElement = (index, value) => {
            const feedback = document.getElementById("feedback");
            const number = parseInt(value);
            if (!isNaN(number)) {
                array[index] = number;
                feedback.innerText = `Updated index ${index} to ${number}`;
                displayArray();
            } else {
                feedback.innerText = "Invalid number!";
            }
        };

        const getElement = () => {
            const index = parseInt(document.getElementById("index").value);
            const feedback = document.getElementById("feedback");

            if (!isNaN(index) && index >= 0 && index < array.length) {
                feedback.innerText = `Value at index ${index}: ${array[index]}`;
            } else {
                feedback.innerText = "Invalid index!";
            }
        };

        const searchNumber = () => {
            const number = parseInt(document.getElementById("number").value);
            const index = array.indexOf(number);
            const feedback = document.getElementById("feedback");

            if (index !== -1) {
                feedback.innerText = `Found ${number} at index ${index}`;
            } else {
                feedback.innerText = `${number} not found in the array.`;
            }
        };



        const clearArray = () => {
            array = [];
            displayArray();
            document.getElementById("feedback").innerText = "Array cleared";
        };

        const openModal = () => {
            document.getElementById("custom-modal").style.display = "block";
            document.getElementById("modal-overlay").style.display = "block";
        };

        const closeModal = () => {
            document.getElementById("custom-modal").style.display = "none";
            document.getElementById("modal-overlay").style.display = "none";
        };

        const confirmModal = () => {
            const input = parseInt(document.getElementById("modal-input").value);
            if (isNaN(input) || input <= 0) {
                document.getElementById("feedback").innerText = "Invalid input! Please enter a positive number.";
                return;
            }
            array = Array.from({ length: input }, () => Math.floor(Math.random() * 1000));
            displayArray();
            document.getElementById("feedback").innerText = `Generated random array of ${input} elements`;
            closeModal();
        };

        const sortDescending = async () => {
            const algorithm = document.getElementById("sort-algorithm").value;

            // First, perform the selected sorting algorithm
            switch(algorithm) {
                case "bubble": await sortBubble(); break;
                case "selection": await sortSelection(); break;
                case "quick": await quickSort(array); break;
                case "insertion": await insertionSort(); break;
                case "merge": await mergeSort(); break;
                case "heap": await heapSort(); break;
            }

            // Then reverse the array to make it descending
            array.reverse();
            displayArray();
            document.getElementById("feedback").innerText = "Sorted in descending order";
        };

        // Existing event listeners from previous script
        document.getElementById('random-icon').addEventListener('click', () => {
            const randomNum = Math.floor(Math.random() * 100);
            document.getElementById('number').value = randomNum;
        });

        document.getElementById('animation-speed').addEventListener('input', (e) => {
            document.getElementById('speed-label').innerText = `Animation Speed: ${e.target.value}ms`;
        });

        const swapElements = (index1, index2) => {
            if (
                index1 < 0 || index1 >= array.length ||
                index2 < 0 || index2 >= array.length
            ) {
                document.getElementById("feedback").innerText = "Indexes out of bounds!";
                return;
            }

            // Swap the elements
            const temp = array[index1];
            array[index1] = array[index2];
            array[index2] = temp;

            // Refresh the display
            displayArray();
        };

        // Attach event listener to the Swap button
        document.getElementById("swap-btn").addEventListener("click", () => {
            const index1 = parseInt(document.getElementById("index1").value, 10);
            const index2 = parseInt(document.getElementById("index2").value, 10);

            // Validate input
            if (isNaN(index1) || isNaN(index2)) {
                document.getElementById("feedback").innerText = "Please enter valid numbers for both indexes!";
                return;
            }

            swapElements(index1, index2);
        });

        // Initial display
        displayArray();
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Advanced Array Simulator",
      "description": "Visualize sorting algorithms and array manipulations with our interactive simulator.",
      "url": "https://www.arraysimulator.com/",
      "author": {
        "@type": "Person",
        "name": "Or Yamin"
      }
    }
