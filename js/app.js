$(document).ready(function () {
    // filter
    (function () {
        const $filterContainer = $('#tm-filter-tyres');
        const $steps = $(".filter-step", $filterContainer);
        const $filterIndicatorContainer = $('#tm-filter-indicators', $filterContainer);
        const $cards = $('.tm-filter-list > li', $filterContainer);
        const filters = setFilters($steps);
        let $activeStep = $steps.eq(0);

        $steps.not($activeStep).hide();
        $activeStep.show(); //just in case

        $steps.on('click', '.tm-filter-step-controls > li', function (e) {
            e.preventDefault();

            const $button = $(this);
            const value = $button.attr('data-step-value');
            const stepName = $button.closest($steps).attr('data-step-name');
            const currFilter = filters[stepName];

            if (currFilter.value === value) {
                currFilter.value = null;
                currFilter.$filterButton = null;
                $button.removeClass('active');
                removeIndicator(stepName);
            } else if (currFilter.value && currFilter.value !== value) {
                currFilter.value = value;
                currFilter.$filterButton.removeClass('active');
                $button.addClass('active');
                currFilter.$filterButton = $button;
                removeIndicator(stepName);
                renderIndicator(value, stepName);
                nextStep();
            } else {
                currFilter.value = value;
                $button.addClass('active');
                currFilter.$filterButton = $button;
                renderIndicator(value, stepName);
                nextStep();
            }

            filterCards();
        });

        $filterIndicatorContainer.on('click', '.tm-remove-indicator', function (e) {
            e.preventDefault();

            const stepName = $(this).closest('[data-step-name]').attr('data-step-name');
            const currFilter = filters[stepName];

            currFilter.value = null;
            currFilter
                .$step
                .find('.tm-filter-step-controls > li.active')
                .removeClass('active');
            removeIndicator(stepName);
            filterCards();

            if ($steps.index($activeStep) <= $steps.index(currFilter.$step)) return;
            goToStep(stepName);
        });

        function setFilters($steps) {
            const currFilters = {};

            for (const step of $steps) {
                const $step = $(step);
                currFilters[$step.attr('data-step-name')] = {
                    $step: $step,
                    name: $step.attr('data-step-name'),
                    $indicator: null,
                    $filterButton: null,
                    value: null,
                };
            }

            return currFilters;
        }

        function renderIndicator(value, stepName) {
            const $indicator = $(`
                <li data-step-name="${stepName}" data-step-value="${value}">
                    <span>
                        <span>${stepName} - ${value}</span>
                        <span class="uk-margin-small-left tm-remove-indicator" uk-icon="icon: close"></span>
                    </span>
                </li>
            `);

            filters[stepName].$indicator = $indicator;
            for (const step of $steps) {
                const $currIndicator = filters[step.getAttribute('data-step-name')].$indicator;
                $filterIndicatorContainer.append($currIndicator);
            }
        }

        function removeIndicator(stepName) {
            $filterIndicatorContainer
                .find(`[data-step-name="${stepName}"]`)
                .remove();
            filters[stepName].$indicator = null;
        }

        function filterCards() {
            let $filteredCards;
            for (const step of $steps) {
                const $step = $(step);
                const stepName = $step.attr('data-step-name');
                const currFilter = filters[stepName];
                const $filteringCards = $filteredCards ? $filteredCards : $cards;

                $filteredCards = $filteringCards.filter(function () {
                    const $card = $(this);
                    return currFilter.value === null ?
                        true :
                        $card.attr(`data-${stepName}`) === currFilter.value;
                });
            }
            $cards.hide();
            $filteredCards.fadeIn(200);
        }

        function nextStep() {
            let $nextStep;
            let nextFilter;
            let i = 1;

            do {
                $nextStep = $steps.eq($steps.index($activeStep) + i);
                nextFilter = filters[$nextStep.attr('data-step-name')];
                i++
            } while (
                nextFilter &&
                nextFilter.value &&
                $steps.index($activeStep) + i !== $steps.length
                );
            changeStep($nextStep);
        }

        function goToStep(stepName) {
            const $nextStep = filters[stepName].$step;
            changeStep($nextStep);
        }

        function changeStep($nextStep) {
            if (!$nextStep.length) return;
            $activeStep.hide();
            $nextStep.show();
            $activeStep = $nextStep;
        }
    })();
});