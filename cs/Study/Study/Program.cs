#define Test

namespace Study
{
    internal partial class Program
    {
        private static void Main()
        {
            try
            {
                //Inheritance.Run();
                //Enumeration.Run();
                //FloatingPoint.Run();
                //Pi.Run();

                //Conditional.Conditional.Test();

                //IPAddressEquals.Run();

                //Cast.Run();

                DebugTest.Run();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            Console.WriteLine("Press any key to exit...");
            Console.ReadLine();
        }
    }
}
