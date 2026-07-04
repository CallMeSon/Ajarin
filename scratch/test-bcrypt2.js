const bcrypt = require("bcryptjs");

const hashes = {
  mentee1: "$2b$10$gG1NY3FG./Ri.UM6XI1FLezdR4qPMOotw9DrV4YUYjVqH1HwpPfj2",
  mentor1: "$2b$10$Iw2qB0zoEk5yD4wQBLQw4ONqFqPQLKenJK8RluolSSzPUFwF6bA9i"
};

const passwords = ["mentee123", "mentor123", "password", "password123"];

async function test() {
  for (const [user, hash] of Object.entries(hashes)) {
    for (const pw of passwords) {
      if (await bcrypt.compare(pw, hash)) {
        console.log(`Password for ${user} is ${pw}`);
      }
    }
  }
}

test();
