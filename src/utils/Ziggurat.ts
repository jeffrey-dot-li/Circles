// Ziggurat Alg for generating Normal Distribution

export default class Normal {
	seed: number;
	wn = Array<number>(128);
	fn = Array<number>(128);
	kn = Array<number>(128);
	jsr = 123456789;

	constructor(seed_?: number) {
		this.seed = typeof seed_ === 'number' ? seed_ : new Date().getTime();
		this.zigset(this.seed);
	}

	RNOR() {
		const hz = this.SHR3();
		const iz = hz & 127;
		return (Math.abs(hz) < this.kn[iz]!) ? hz * this.wn[iz]! : this.nfix(hz, iz);
	}

	nfix(hz: number, iz: number) {
		const r = 3.442619855899;
		const r1 = 1.0 / r;
		let x;
		let y;
		while (true) {
			x = hz * this.wn[iz]!;
			if (iz === 0) {
				x = (-Math.log(this.UNI()) * r1);
				y = -Math.log(this.UNI());
				while (y + y < x * x) {
					x = (-Math.log(this.UNI()) * r1);
					y = -Math.log(this.UNI());
				}
				return (hz > 0) ? r + x : -r - x;
			}
			if (this.fn[iz]! + this.UNI() * (this.fn[iz - 1]! - this.fn[iz]!) < Math.exp(-0.5 * x * x))
				return x;

			hz = this.SHR3();
			iz = hz & 127;

			if (Math.abs(hz) < this.kn[iz]!)
				return (hz * this.wn[iz]!);
		}
	}

	SHR3() {
		const jz = this.jsr;
		let jzr = this.jsr;
		jzr ^= (jzr << 13);
		jzr ^= (jzr >>> 17);
		jzr ^= (jzr << 5);
		this.jsr = jzr;
		return (jz + jzr) || 0;
	}

	UNI() {
		return 0.5 * (1 + this.SHR3() / -Math.pow(2, 31));
	}

	zigset(seed: number) {
		// seed generator based on current time
		this.jsr ^= seed;

		const m1 = 2147483648.0;
		let dn = 3.442619855899;
		let tn = dn;
		const vn = 9.91256303526217e-3;

		const q = vn / Math.exp(-0.5 * dn * dn);
		this.kn[0] = Math.floor((dn / q) * m1);
		this.kn[1] = 0;

		this.wn[0] = q / m1;
		this.wn[127] = dn / m1;

		this.fn[0] = 1.0;
		this.fn[127] = Math.exp(-0.5 * dn * dn);

		for (let i = 126; i >= 1; i--) {
			dn = Math.sqrt(-2.0 * Math.log(vn / dn + Math.exp(-0.5 * dn * dn)));
			this.kn[i + 1] = Math.floor((dn / tn) * m1);
			tn = dn;
			this.fn[i] = Math.exp(-0.5 * dn * dn);
			this.wn[i] = dn / m1;
		}
	}
}
