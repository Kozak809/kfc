document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  // Helper to get gap
  const getGap = () => {
    const style = window.getComputedStyle(track);
    return parseFloat(style.gap) || 0;
  };

  // Initial setup check
  let originalItems = document.querySelectorAll('.card-item');
  if (!track || !prevBtn || !nextBtn || originalItems.length === 0) return;

  const originalCount = originalItems.length;
  let isAnimating = false;

  // Clone items for infinite loop: [Clones_Before, Originals, Clones_After]
  // We clone the entire set to ensure we have enough buffer.
  
  // Clone for start (prepend)
  // We reverse them to prepend in correct order if we iterate standard, 
  // but simpler is to just clone the list and insert before.
  // Actually, we want the sequence ... A B C [A B C] A B C ...
  // So the "Clones Before" is just a copy of the list.
  
  const clonesBefore = [];
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    clone.classList.add('clone-start');
    clonesBefore.push(clone);
  });
  // Prepend in order
  clonesBefore.forEach(clone => track.insertBefore(clone, track.firstChild));

  // Clone for end (append)
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    clone.classList.add('clone-end');
    track.appendChild(clone);
  });

  // Re-query all items (Clones + Originals)
  const allItems = document.querySelectorAll('.card-item');
  
  // Start at the first original item (index = originalCount)
  let currentIndex = originalCount; 
  
  const updateTrackPosition = (enableTransition = true) => {
    const gap = getGap();
    let scrollAmount = 0;
    
    // Sum widths of all items before current index
    for (let i = 0; i < currentIndex; i++) {
       scrollAmount += allItems[i].offsetWidth + gap;
    }

    if (!enableTransition) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.3s ease-in-out';
    }
    
    track.style.transform = `translateX(-${scrollAmount}px)`;
  };

  // Set initial position without animation
  updateTrackPosition(false);
  
  // Enable buttons (ensure they are visible/active)
  prevBtn.style.opacity = '1';
  prevBtn.style.pointerEvents = 'auto';
  nextBtn.style.opacity = '1';
  nextBtn.style.pointerEvents = 'auto';

  const moveNext = () => {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex++;
    updateTrackPosition(true);
  };

  const movePrev = () => {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex--;
    updateTrackPosition(true);
  };

  nextBtn.addEventListener('click', moveNext);
  prevBtn.addEventListener('click', movePrev);

  // Handle Loop Reset
  track.addEventListener('transitionend', () => {
    isAnimating = false;
    
    // If we scrolled into the "End Clones" section
    // The "End Clones" start at index: originalCount * 2
    if (currentIndex >= originalCount * 2) {
      // Jump back to the start of the "Originals"
      // Calculate the offset relative to the start of the set
      const relativeIndex = currentIndex - (originalCount * 2);
      currentIndex = originalCount + relativeIndex;
      updateTrackPosition(false);
    }
    
    // If we scrolled into the "Start Clones" section
    // The "Start Clones" end at index: originalCount - 1
    else if (currentIndex < originalCount) {
      // Jump to the corresponding position in "Originals" (or specifically, the "End Clones" logic??)
      // No, we jump to the *end* of the "Originals" set usually?
      // Wait, A' B' C' [A B C] A'' B'' C''
      // Indices: 0 1 2 [3 4 5] 6 7 8 (Count=3)
      // Current = 2 (C'). We want to be at 5 (C).
      // Formula: currentIndex + originalCount
      currentIndex = currentIndex + originalCount;
      updateTrackPosition(false);
    }
  });

  // Handle resize
  window.addEventListener('resize', () => {
    // Recalculate position immediately to keep alignment
    updateTrackPosition(false);
  });
});
