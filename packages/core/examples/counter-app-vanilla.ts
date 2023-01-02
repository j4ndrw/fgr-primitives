import { encapsulate } from "../src";

encapsulate(({ signal, effect, batch }) => {
    const Title = document.createElement("h1");
    const Paragraph1 = document.createElement("p");
    const Paragraph2 = document.createElement("p");
    const Button = document.createElement("button");

    const count = signal(0);
    const count2 = signal(0);

    effect(() => {
        Paragraph1.textContent = `Count1 is ${count.get()}`;
        Paragraph2.textContent = `Count2 is ${count2.get()}`;
    });

    Button.addEventListener("click", () => {
        batch(() => {
            count.update(prev => prev + 1);
            count2.update(prev => prev + 3);
        });
    });

    Button.addEventListener("click", () => {
        batch(() => {
            count.update(prev => prev * 2);
            count2.update(prev => prev * 4);
        });
    });

    Title.textContent = "Counts";
    Button.textContent = "Update counts";

    document.body.appendChild(Title);
    document.body.appendChild(Paragraph1);
    document.body.appendChild(Paragraph2);
    document.body.appendChild(Button);
});
