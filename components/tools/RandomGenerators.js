"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

const DATA_POOLS = {
  "random-emoji": [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "👽", "👾", "🤖", "🎃", "😺", "😸", "🚀", "🛸", "🔥", "✨", "🎉", "🏆", "💎", "🍕", "🍔", "🍣"
  ],
  "random-animal": [
    "Lion", "Tiger", "Elephant", "Giraffe", "Cheetah", "Kangaroo", "Panda", "Koala", "Polar Bear", "Penguin",
    "Zebra", "Hippopotamus", "Rhinoceros", "Leopard", "Wolf", "Red Fox", "Brown Bear", "Eagle", "Falcon", "Owl",
    "Dolphin", "Blue Whale", "Great White Shark", "Octopus", "Sea Turtle", "Otter", "Chameleon", "Gorilla", "Sloth", "Flamingo"
  ],
  "random-food": [
    "Margherita Pizza", "Cheeseburger & Crispy Fries", "Authentic Ramen Bowl", "Sushi Platter (Nigiri & Maki)",
    "Tacos al Pastor", "Pad Thai Noodles", "Chicken Tikka Masala", "Pasta Carbonara", "French Croissant & Espresso",
    "Belgian Waffles with Strawberries", "Burrito Bowl", "Greek Salad with Feta", "Dim Sum Dumplings", "Barbecue Ribs",
    "Paella Valenciana", "Avocado Toast with Poached Egg", "Pho Noodle Soup", "Crispy Falafel Wrap"
  ],
  "random-hobby": [
    "Photography & Photo Editing", "Astronomy & Stargazing", "Indoor Plant Gardening", "Learning Acoustic Guitar",
    "Chess Strategy & Tactics", "Ceramics & Pottery", "Digital Illustration", "Rock Climbing & Bouldering",
    "Creative Writing & Fiction", "Specialty Coffee Brewing", "Woodworking & Carpentry", "Baking Artisan Bread",
    "Scuba Diving & Snorkeling", "3D Printing & Modeling", "Origami & Paper Crafting", "Language Learning"
  ],
  "random-movie": [
    "Inception (2010)", "Interstellar (2014)", "The Dark Knight (2008)", "Pulp Fiction (1994)",
    "The Matrix (1999)", "Spirited Away (2001)", "Parasite (2019)", "Whiplash (2014)",
    "Gladiator (2000)", "The Shawshank Redemption (1994)", "Spider-Man: Into the Spider-Verse (2018)",
    "Everything Everywhere All at Once (2022)", "Goodfellas (1990)", "Oppenheimer (2023)"
  ],
  "random-fruits": [
    "Mango", "Dragon Fruit", "Passion Fruit", "Honeycrisp Apple", "Sweet Blueberry", "Ripe Avocado",
    "Pomegranate", "Kiwi Fruit", "Pineapple", "Blackberry", "Watermelon", "Papaya", "Guava",
    "Sweet Cherry", "Peach", "Plum", "Fig", "Lychee", "Starfruit", "Grapefruit"
  ],
  "random-marvel-character": [
    "Iron Man (Tony Stark)", "Spider-Man (Peter Parker)", "Captain America (Steve Rogers)", "Thor Odinson",
    "Doctor Strange", "Black Panther (T'Challa)", "Wolverine (Logan)", "Deadpool (Wade Wilson)",
    "Scarlet Witch (Wanda Maximoff)", "Hulk (Bruce Banner)", "Loki Laufeyson", "Black Widow (Natasha Romanoff)",
    "Star-Lord (Peter Quill)", "Groot", "Moon Knight (Marc Spector)", "Magneto (Erik Lehnsherr)"
  ],
  "random-disney-character": [
    "Mickey Mouse", "Donald Duck", "Goofy", "Simba (The Lion King)", "Aladdin", "Genie",
    "Elsa (Frozen)", "Moana", "Woody (Toy Story)", "Buzz Lightyear", "Mulan", "Stitch (Lilo & Stitch)",
    "Rapunzel (Tangled)", "Baymax (Big Hero 6)", "Hercules", "Tarzan", "Peter Pan"
  ],
  "random-female-name": [
    "Emma Charlotte", "Olivia Sophia", "Amelia Grace", "Ava Isabella", "Mia Harper",
    "Evelyn Rose", "Luna Penelope", "Chloe Violet", "Eleanor Claire", "Aria Hazel",
    "Zoe Scarlett", "Stella Victoria", "Aurora Lillian", "Maya Elizabeth", "Elena Nora"
  ],
  "random-male-name": [
    "Liam Alexander", "Noah Benjamin", "Oliver James", "Elijah Lucas", "William Henry",
    "James Theodore", "Benjamin Samuel", "Lucas Gabriel", "Henry Sebastian", "Alexander Daniel",
    "Ethan Matthew", "Daniel Joseph", "Julian David", "Leo Thomas", "Arthur Michael"
  ],
  "default": [
    "Item Alpha", "Item Beta", "Item Gamma", "Item Delta", "Item Epsilon",
    "Item Zeta", "Item Eta", "Item Theta", "Item Iota", "Item Kappa"
  ]
};

export default function RandomGenerators({ type = "random-emoji", title = "Random Generator" }) {
  const pool = DATA_POOLS[type] || DATA_POOLS["default"];
  const [count, setCount] = useState(1);
  const [results, setResults] = useState([pool[Math.floor(Math.random() * pool.length)]]);

  const generate = () => {
    const picked = [];
    const available = [...pool];
    for (let i = 0; i < count; i++) {
      if (available.length === 0) break;
      const idx = Math.floor(Math.random() * available.length);
      picked.push(available[idx]);
      if (count <= available.length) {
        available.splice(idx, 1);
      }
    }
    setResults(picked);
  };

  const copyText = results.join("\n");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-sm text-slate-500 mb-6">
          Generate instant random ideas, characters, names, or values with a single click.
        </p>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
              <div className="flex items-center gap-1.5">
                {[1, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCount(num)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      count === num
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              🎲 Generate New
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600 uppercase">Generated Result</span>
              {copyText && <CopyButton text={copyText} />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-base flex items-center justify-between shadow-sm animate-in fade-in zoom-in-95 duration-200"
                >
                  <span className="truncate">{item}</span>
                  <span className="text-xs text-slate-400 font-normal">#{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
