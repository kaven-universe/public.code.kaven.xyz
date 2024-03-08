
namespace Study
{
    public class Pi
    {
        public static void Run()
        {
            var pi = MonteCarloApproximate(1000000000);
            Console.WriteLine(pi);
        }

        public static double MonteCarloApproximate(int numPoints)
        {
            var random = new Random();
            var pointsInsideCircle = 0;

            for (var i = 0; i < numPoints; i++)
            {
                var x = random.NextDouble() * 2 - 1; // Random x-coordinate between -1 and 1
                var y = random.NextDouble() * 2 - 1; // Random y-coordinate between -1 and 1
                var distanceSquared = x * x + y * y;

                if (distanceSquared <= 1)
                {
                    pointsInsideCircle++;
                }
            }

            return 4.0 * pointsInsideCircle / numPoints;
        }
    }
}
