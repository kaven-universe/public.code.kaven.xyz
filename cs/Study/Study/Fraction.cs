using System;
using System.Numerics;

namespace Study
{
    public struct Fraction(BigInteger numerator, BigInteger denominator)
    {
        public BigInteger Numerator = numerator;
        public BigInteger Denominator = denominator;

        public Fraction(BigInteger numerator)
            : this(numerator, BigInteger.One)
        {

        }

        public Fraction()
            : this(BigInteger.Zero)
        {

        }

        public static explicit operator Fraction(int v) => new(v);
        public static explicit operator Fraction(uint v) => new(v);
        public static explicit operator Fraction(long v) => new(v);
        public static explicit operator Fraction(ulong v) => new(v);

        public static Fraction operator +(Fraction a) => a;
        //public static Fraction operator -(Fraction a) => new(-a.Numerator, a.Denominator);

        public static Fraction operator +(Fraction a, Fraction b)
        {
            var lcm = Functions.LCM(a.Denominator, b.Denominator);
            var fa = lcm / a.Denominator;
            var fb = lcm / b.Denominator;

            var na = a.Numerator * fa;
            var nb = b.Numerator * fb;

            return new(na + nb, lcm);
        }

        //public static Fraction operator -(Fraction a, Fraction b) => a + (-b);

        public static Fraction operator *(Fraction fraction1, Fraction fraction2)
        {
            return new Fraction(fraction1.Numerator * fraction2.Numerator, fraction1.Denominator * fraction2.Denominator);
        }

        public static Fraction operator *(int intValue, Fraction fraction)
        {
            return new Fraction(intValue * fraction.Numerator, fraction.Denominator);
        }

        public static Fraction operator /(Fraction a, Fraction b)
        {
            if (b.Numerator == 0)
            {
                throw new DivideByZeroException();
            }
            return new Fraction(a.Numerator * b.Denominator, a.Denominator * b.Numerator);
        }

        public override readonly string ToString() => $"{Numerator} / {Denominator}";

        public readonly Fraction Simplify()
        {
            var gcd = Functions.GCD(Numerator, Denominator);
            return new Fraction(Numerator / gcd, Denominator / gcd);
        }

        public readonly string ToString(int precision)
        {
            return Functions.Divide(Numerator, Denominator, precision);
        }

        public static Fraction FromPow(BigInteger value, int pow)
        {
            if (pow == 0)
            {
                return new Fraction(1, 1); // Anything to the power of 0 is 1
            }

            if (pow < 0)
            {
                return new Fraction(1, BigInteger.Pow(value, -pow));
            }
            else
            {
                return new Fraction(BigInteger.Pow(value, pow), 1);
            }
        }
    }
}
