import bcrypt from 'bcrypt';

class Hash {
  hash(data: string): string {
    return bcrypt.hashSync(data, 8);
  }

  compare(data: string, encrypted: string) {
    return bcrypt.compareSync(data, encrypted);
  }
}

export default new Hash();
