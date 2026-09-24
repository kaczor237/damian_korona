((currentScript) => {
  window.addEventListener("DOMContentLoaded", () => {
    const src = currentScript?.getAttribute("src");
    const url = src ? new URL(src, document.baseURI) : null;

    let params = url.searchParams;

    // Settings
    const position = params.get("position") || "bottom-right";
    const tool = (params.get("tool") || "comparer").split(",");
    const style = params.get("style") || "1";
    const bubbleStyle = params.get("bubble_style") || "1";
    const color = params.get("color");
    const plain = params.get("plain");
    const phone = params.get("phone");
    const lang = params.get("lang");

    let toolUrlMap = {
      refinance: "https://kalkulatorrefinansowania.angfinanse.pl/",
      consolidation: "https://kalkulatorkonsolidacji.angfinanse.pl/",
      comparer: "https://porownywarkagotowkowa.angfinanse.pl/",
      creditworthiness: "https://kalkulatorzdolnosci.angfinanse.pl/",
      overpayment: "https://kalkulatornadplat.angfinanse.pl/",
      mortgageComparer: "https://porownywarkahipoteczna.angfinanse.pl/",
    };

    // Reorder tools: mortgageComparer always first, comparer always second
    const priority = ["mortgageComparer", "comparer"];
    const uniqueTools = Array.from(new Set(tool)); // remove duplicates

    uniqueTools.sort((a, b) => {
      const aIndex = priority.indexOf(a);
      const bIndex = priority.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    const reorderedTool = uniqueTools;

    // Use the first tool to determine base URL
    let toolUrl = toolUrlMap[reorderedTool[0]];

    // Build query parameters
    let queryParams = [];
    if (reorderedTool.length)
      queryParams.push(`tool=${reorderedTool.join(",")}`);
    if (style) queryParams.push(`style=${encodeURIComponent(style)}`);
    if (color) queryParams.push(`color=${encodeURIComponent(color)}`);
    if (plain) queryParams.push(`plain=${encodeURIComponent(plain)}`);
    if (phone) queryParams.push(`phone=${encodeURIComponent(phone)}`);

    const passthroughKeys = [
      "lang",
      "amount",
      "comparer_amount",
      "mortgage_comparer_amount",
      "period",
      "comparer_period",
      "mortgage_comparer_period",
      "lead_partner_uid",
      "source_uid",
      "user_uid",
      "institution_uid",
      "noform",
      "autofetch",
      "property_type",
      "developer",
      "property_value",
      "type_interest",
      "own_contribution",
      "start_time",
      "end_time",
      "age",
      "total_people",
      "credit_obligations",
      "credit_card_limits",
      "hide_contact",
    ];
    for (const key of passthroughKeys) {
      const val = params.get(key);
      if (val) queryParams.push(`${key}=${encodeURIComponent(val)}`);
    }

    // Combine URL + query params
    if (queryParams.length > 0) {
      toolUrl += `?${queryParams.join("&")}`;
    }

    // Translation mapping for 4 languages
    const translations = {
      pl: {
        multiTool: "Porównaj, sprawdź, oblicz",
        refinance: "Sprawdź refinansowanie",
        consolidation: "Sprawdź konsolidację",
        comparer: "Porównaj kredyty",
        creditworthiness: "Oblicz zdolność kredytową",
        overpayment: "Sprawdź nadpłatę kredytu",
      },
      en: {
        multiTool: "Compare, check, calculate",
        refinance: "Check refinancing",
        consolidation: "Check consolidation",
        comparer: "Compare loans",
        creditworthiness: "Calculate creditworthiness",
        overpayment: "Check loan overpayment",
      },
      uk: {
        multiTool: "Порівняйте, перевірте, розраховуйте",
        refinance: "Перевірте рефінансування",
        consolidation: "Перевірте консолідацію",
        comparer: "Порівняйте кредити",
        creditworthiness: "Розраховуйте кредитоспроможність",
        overpayment: "Перевірте переплату кредиту",
      },
      be: {
        multiTool: "Параўнайце, праверьце, разлічыце",
        refinance: "Праверьце рефінансаванне",
        consolidation: "Праверьце консолідацыю",
        comparer: "Параўнайце крэдыты",
        creditworthiness: "Разлічыце крэдытаздальнасць",
        overpayment: "Праверьце пераплату крэдыту",
      },
    };

    // Get the language from parameters, default to Polish
    const selectedLang = lang || "pl";
    const langTexts = translations[selectedLang] || translations.pl;

    const dragon = `
				<svg
					fill="none"
					viewBox="0 0 120 120"
					xmlns="http://www.w3.org/2000/svg"
					width="100%"
					height="100%"
				>
					<g class="dragon">
						<path fill="white" d="M40.6394 67.4129C39.7821 66.6776 38.4446 66.7445 37.6901 67.6134C36.9356 68.4824 37.0385 69.7858 37.8958 70.5211L45.5093 77.0716L37.8958 94.1163H34.6721C33.5061 94.1163 32.5801 95.0521 32.5801 96.1884C32.5801 97.3247 33.5061 98.2605 34.6721 98.2605H40.6394L50.5849 75.9353L40.6394 67.3795V67.4129Z" fill="white"/>
						<path fill="white" d="M34.6388 80.3813C35.1876 80.3813 35.7706 80.1473 36.1478 79.7128C36.9366 78.8773 36.9023 77.5739 36.0449 76.7718L29.0145 70.2547L34.8789 63.1026C35.5991 62.2002 35.4619 60.8968 34.5703 60.1949C33.6786 59.4597 32.3411 59.5934 31.6209 60.4957L23.3215 70.6223L33.1984 79.7797C33.61 80.1473 34.1244 80.3478 34.6388 80.3478V80.3813Z" fill="white"/>
						<path fill="white" d="M66.019 82.583C66.019 81.4467 65.093 80.5109 63.927 80.5109H55.1132L47.2597 95.2496C46.711 96.2523 47.1225 97.5223 48.1171 98.057C48.4257 98.2241 48.7687 98.2909 49.0773 98.2909C49.8318 98.2909 50.552 97.8899 50.9293 97.188L57.6168 84.6552H63.927C65.093 84.6552 66.019 83.7194 66.019 82.583Z" fill="white"/>
						<path fill="white" d="M34.0554 39.906C35.1872 39.8058 36.0446 38.7697 35.9074 37.6334C35.7702 36.4971 34.7757 35.6281 33.6095 35.7952L26.2361 36.5305L24.6586 33.8902L33.0265 25.5684H43.6238L42.2863 27.4734L45.5443 32.7205V49.5647C45.5443 50.701 46.4702 51.6368 47.6363 51.6368C48.8023 51.6368 49.7283 50.701 49.7283 49.5647V31.5173L47.2933 27.5737L51.6488 21.3908H31.3118L19.4114 33.1884L23.9727 40.9087L34.0211 39.906H34.0554Z" fill="white"/>
						<path fill="white" d="M78.81 55.8151C78.5699 56.9514 79.3244 58.0209 80.4561 58.2549L106.76 63.502L87.2808 27.6079L69.859 23.8647L57.8558 37.4001V54.6454L75.209 70.1862V81.3154L82.2737 88.3338L81.8965 96.1209C81.8279 97.2572 82.7196 98.2264 83.8856 98.2933H83.9885C85.0859 98.2933 86.0119 97.4243 86.0805 96.3214L86.5606 86.6962L79.4273 79.6109V68.348L62.0741 52.8072V38.9709L71.4023 28.41L84.5372 31.2174L98.8725 57.6533L81.2792 54.1441C80.1475 53.9101 79.05 54.6454 78.81 55.7483V55.8151Z" fill="white"/>
						<path fill="white" d="M75.3458 87.5621C74.317 87.0274 73.0481 87.4284 72.5337 88.4645L69.55 94.1461H64.7487C63.5827 94.1461 62.6567 95.0819 62.6567 96.2182C62.6567 97.3545 63.5827 98.2903 64.7487 98.2903H72.0878L76.2375 90.3695C76.7519 89.3669 76.3747 88.0969 75.3458 87.5621Z" fill="white"/>
					</g>
				</svg>
			`;

    // Animation for trigger bubble
    const bounceUpAnimation = [
      {
        transform: "translateY(0px)",
        boxShadow: "0 7px 10px 0px rgba(0,0,0,0.2)",
      },
      {
        transform: "translateY(-6px)",
        boxShadow: "0 10px 10px 0px rgba(0,0,0,0.1)",
      },
      {
        transform: "translateY(0px)",
        boxShadow: "0 7px 10px 0px rgba(0,0,0,0.2)",
      },
    ];

    const bounceUpAnimationTiming = {
      duration: 2000,
      iterations: Infinity,
    };

    const triggerWrapper = document.createElement("button");
    triggerWrapper.classList.add("ang-modal__trigger");

    const dragonWrapper = document.createElement("div");
    dragonWrapper.classList.add("ang-modal__dragon");
    dragonWrapper.innerHTML = dragon;

    const bubble = document.createElement("div");
    bubble.classList.add("ang-modal__triggerBubble");

    bubble.appendChild(dragonWrapper);
    let text = document.createElement("div");
    text.classList.add("ang-modal__text");

    // Set text content using translations based on selected language
    if (tool.length > 1) {
      text.textContent = langTexts.multiTool;
    } else {
      if (tool[0] === "refinance") {
        text.textContent = langTexts.refinance;
      } else if (tool[0] === "consolidation") {
        text.textContent = langTexts.consolidation;
      } else if (tool[0] === "creditworthiness") {
        text.textContent = langTexts.creditworthiness;
      } else if (tool[0] === "comparer" || tool[0] === "mortgageComparer") {
        text.textContent = langTexts.comparer;
      } else {
        text.textContent = langTexts.overpayment;
      }
    }

    bubble.append(text);

    const bubbleClose = document.createElement("button");
    bubbleClose.classList.add("ang-modal__bubbleClose");
    bubbleClose.setAttribute("aria-label", "Zamknij dymek");
    bubbleClose.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.113903 0.113903C0.265773 -0.0379676 0.512004 -0.0379676 0.663875 0.113903L3.5 2.95003L6.33612 0.113903C6.488 -0.0379672 6.73423 -0.0379672 6.8861 0.113903C7.03797 0.265774 7.03797 0.512005 6.8861 0.663875L4.04997 3.5L6.8861 6.33612C7.03797 6.488 7.03797 6.73423 6.8861 6.8861C6.73423 7.03797 6.488 7.03797 6.33612 6.8861L3.5 4.04997L0.663875 6.8861C0.512004 7.03797 0.265774 7.03797 0.113903 6.8861C-0.0379676 6.73423 -0.0379676 6.488 0.113903 6.33612L2.95003 3.5L0.113903 0.663875C-0.0379676 0.512004 -0.0379676 0.265773 0.113903 0.113903Z" fill="#591144"/></svg>';

    bubble.appendChild(bubbleClose);

    triggerWrapper.append(bubble);

    switch (position) {
      case "bottom-left":
        bubble.classList.add("ang-modal__triggerBubble--bottom-left");
        text.classList.add("ang-modal__text--left");
        break;
      case "bottom-right":
        bubble.classList.add("ang-modal__triggerBubble--bottom-right");
        text.classList.add("ang-modal__text--right");
        break;
      case "top-right":
        bubble.classList.add("ang-modal__triggerBubble--top-right");
        text.classList.add("ang-modal__text--right");
        break;
      case "top-left":
        bubble.classList.add("ang-modal__triggerBubble--top-left");
        text.classList.add("ang-modal__text--left");
        break;
      default:
        bubble.classList.add("ang-modal__triggerBubble--bottom-right");
        text.classList.add("ang-modal__text--right");
        break;
    }

    if (bubbleStyle === "2") {
      bubble.classList.add("ang-modal__triggerBubble--style2");
    } else if (bubbleStyle === "3") {
      bubble.classList.add("ang-modal__triggerBubble--style3");
    } else {
      bubble.classList.add("ang-modal__triggerBubble--style1");
    }

    // Create the modal container
    const modal = document.createElement("div");
    modal.classList.add("ang-modal");

    // Create the iframe wrapper with transition
    const iframeWrapper = document.createElement("div");

    // Create the iframe
    const iframe = document.createElement("iframe");
    iframe.src = toolUrl;
    iframe.classList.add("ang-modal__iframe");

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.classList.add("button--close");

    // SVG icon
    const icon = `
		  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red">
				<path fill="#772e62" fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
		  </svg>
		`;

    // Set up the button
    closeButton.innerHTML = icon;

    // Append iframe inside the wrapper
    iframeWrapper.appendChild(iframe);
    iframeWrapper.appendChild(closeButton);
    modal.appendChild(iframeWrapper);
    document.body.appendChild(triggerWrapper);
    document.body.appendChild(modal);

    // Media Query for responsive iframe wrapper and styles
    const styles = document.createElement("style");
    styles.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
			@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mahajani&display=swap');

      .ang-modal__trigger {
        position: fixed;
        z-index: 9999;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 0;
      }

      .ang-modal__dragon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #591144;
        color: #f9f9f9;
        border: none;
        cursor: pointer;
      }

      .ang-modal__triggerBubble {
        display: flex;
				align-items: center;
				gap: 0;
				padding: 4px 16px 4px 4px;
        background: white;
        position: fixed;
        border-radius: 40px;
        min-height: 40px;
        transition: 300ms ease-in-out opacity;
        box-shadow: 0 7px 10px 0px rgba(0,0,0,0.2);
        animation: bounceUp 2s infinite;
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }

      @keyframes bounceUp {
        0% {
          transform: translate3d(0, 0, 0);
          box-shadow: 0 7px 10px 0px rgba(0,0,0,0.2);
        }
        50% {
          transform: translate3d(0, -6px, 0);
          box-shadow: 0 10px 10px 0px rgba(0,0,0,0.1);
        }
        100% {
          transform: translate3d(0, 0, 0);
          box-shadow: 0 7px 10px 0px rgba(0,0,0,0.2);
        }
      }

      .ang-modal__triggerBubble.ang-modal__triggerBubble--collapsed {
        animation: none;
      }

      .ang-modal__triggerBubble--bottom-left {
        bottom: 62px;
        left: 66px;
        flex-direction: row;
      }

      .ang-modal__triggerBubble--bottom-right {
        bottom: 62px;
        right: 66px;
        flex-direction: row;
      }

      .ang-modal__triggerBubble--top-right {
        top: 62px;
        right: 66px;
        flex-direction: row;
      }

      .ang-modal__triggerBubble--top-left {
        top: 62px;
        left: 66px;
        flex-direction: row;
      }

      .ang-modal__triggerBubble--style1 {
        background: #f9f9f9;
      }

      .ang-modal__triggerBubble--style1 .ang-modal__dragon {
        background: #591144;
      }

      .ang-modal__triggerBubble--style1 .dragon path {
        fill: #f9f9f9;
      }

      .ang-modal__triggerBubble--style1 .ang-modal__text {
        fill: #591144;
      }


      .ang-modal__triggerBubble .ang-modal__text {
        font-size: 0.9rem;
				font-weight: 500;
				letter-spacing: 1px;
				text-wrap: nowrap;
      }

      .ang-modal__triggerBubble--style2 {
        background: #591144;
      }

      .ang-modal__triggerBubble--style2 .ang-modal__dragon {
        background: #ffffff;
      }

      .ang-modal__triggerBubble--style2 .dragon path {
        fill: #591144;
      }

      .ang-modal__triggerBubble--style2 .ang-modal__text {
        fill: #ffffff;
      }

      .ang-modal__triggerBubble--style2 .ang-modal__text {
        color: #ffffff;
      }

      .ang-modal__triggerBubble--style3 {
        background: #591144;
      }

      .ang-modal__triggerBubble--style3 .ang-modal__dragon {
        background: #d32858;
      }

      .ang-modal__triggerBubble--style3 .dragon path {
        fill: #ffffff;
      }

      .ang-modal__triggerBubble--style3 .ang-modal__text svg path {
        fill: #ffffff;
      }

      .ang-modal__triggerBubble--style3 .ang-modal__text {
        color: #ffffff;
      }

      .ang-modal__text {
        display: flex;
        align-items: center;
        max-width: 210px;
        overflow: hidden;
        margin-left: 8px;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 600;
        transition: max-width 0.3s linear, opacity 0.3s ease-in-out, margin 0.3s linear;
        backface-visibility: hidden;
        will-change: opacity;
      }

      .ang-modal__bubbleClose {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
				transform: translate(50%, -50%);
        border: none;
        background: #f5f5f5;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        border-radius: 50%;
        color: #591144;
        transition: opacity 0.3s ease-in-out, background-color 0.2s ease-in-out;
      }

			.ang-modal__bubbleClose svg {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 8px;
				height: 8px;
			}

      .ang-modal__triggerBubble--collapsed {
        gap: 0;
        padding-right: 4px;
      }

      .ang-modal__triggerBubble--collapsed .ang-modal__text {
        max-width: 0;
        opacity: 0;
        margin-left: 0;
      }

      .ang-modal__triggerBubble--collapsed .ang-modal__bubbleClose {
        opacity: 0;
      }

      .ang-modal__triggerBubble--style1 .ang-modal__bubbleClose {
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
        border: none;
      }

      .ang-modal__triggerBubble--style2 .ang-modal__bubbleClose,
      .ang-modal__triggerBubble--style3 .ang-modal__bubbleClose {
        border: 1px solid #591144;
        box-shadow: none;
      }

      .ang-modal__triggerBubble--style3 .ang-modal__bubbleClose:hover {
        background: #D32858;
      }

      .ang-modal__triggerBubble--style1 .ang-modal__bubbleClose:hover,
      .ang-modal__triggerBubble--style2 .ang-modal__bubbleClose:hover {
        background: #591144;
      }

      .ang-modal__triggerBubble--style1 .ang-modal__bubbleClose:hover svg path,
      .ang-modal__triggerBubble--style2 .ang-modal__bubbleClose:hover svg path,
      .ang-modal__triggerBubble--style3 .ang-modal__bubbleClose:hover svg path {
        fill: #ffffff;
      }



      .ang-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 99999;
      }

      .ang-modal__wrapper {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
        overflow: hidden;
        background: #fff;
        transform: scale(0);
        opacity: 0;
        transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
        position: relative;
      }

      .ang-modal__wrapper::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }

      .ang-modal__iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .button--close {
        position: absolute;
        top: 12px;
        right: 30px;
        background-color: white;
        border: none;
        border-radius: 50%;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
        z-index: 9999;
        font-size: 24px;
      }

      .button--close:hover {
        transition: 250ms ease-in-out opacity;
        opacity: 0.75;
      }

      @media (max-width: 768px) {
        .ang-modal__wrapper {
          width: 100vw;
          height: 100vh;
          border-radius: 0;
        }

        .ang-modal__triggerBubble--bottom-right {
          bottom: 16px;
          right: 16px;
        }

        .ang-modal__triggerBubble--bottom-left {
          bottom: 16px;
          left: 16px;
        }

        .ang-modal__triggerBubble--top-right {
          top: 16px;
          right: 16px;
        }

        .ang-modal__triggerBubble--top-left {
          top: 16px;
          left: 16px;
        }

        .ang-modal__triggerBubble .ang-modal__text {
          font-size: 0.8rem;
        }
      }
      @media (min-width: 769px) {
        .ang-modal__wrapper {
          width: 80vw;
          max-width: 1280px;
          height: 80vh;
          border-radius: 10px !important;
          overflow: hidden;
        }
      }
    `;
    document.head.appendChild(styles);

    bubbleClose.addEventListener("click", (e) => {
      e.stopPropagation();
      bubble.classList.add("ang-modal__triggerBubble--collapsed");
    });

    triggerWrapper.addEventListener("click", () => {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
      bubble.style.opacity = "0";
      setTimeout(() => {
        Object.assign(iframeWrapper.style, {
          transform: "scale(1)",
          opacity: "1",
        });
      }, 10);
    });

    function closeModal() {
      Object.assign(iframeWrapper.style, {
        transform: "scale(0.8)",
        opacity: "0",
      });
      setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        bubble.style.opacity = "1";
      }, 300);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });

    iframeWrapper.classList.add("ang-modal__wrapper");
  });
})(document.currentScript);
